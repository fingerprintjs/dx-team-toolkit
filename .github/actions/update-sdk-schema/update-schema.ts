import * as fs from 'fs'
import * as unzipper from 'unzipper'
import * as path from 'path'
import * as cp from 'child_process'
import * as core from '@actions/core'
import { getOctokit } from '@actions/github'
import { addPreReleaseNotes, createChangeset, startPreRelease } from './changesets'
import { downloadAsset, findAsset, getReleaseNotes } from './github'

const SCHEMA_FILE = 'fingerprint-server-api-schema-for-sdks.yaml'
const RELEASE_NOTES = 'release-notes.json'
const EXAMPLES_FILE = 'examples.zip'
const EXAMPLE_PATH_TO_REPLACE = 'examples/'
const CHANGESETS_PATH = '.changeset'

async function main() {
  const packageJson = JSON.parse(fs.readFileSync(path.join('./package.json'), 'utf-8'))

  const schemaPath = core.getInput('schemaPath')
  const examplesPath = core.getInput('examplesPath')
  const generateCommand = core.getInput('generateCommand')
  const tag = core.getInput('tag')
  const githubToken = core.getInput('githubToken')
  const preRelease = core.getInput('preRelease') === 'true'
  const [owner, repo] = core.getInput('openApiRepository').split('/')
  const ignoredScopes = core.getInput('ignoredScopes').split(',').filter(Boolean)

  const octokit = getOctokit(githubToken)

  const release = await octokit.rest.repos.getReleaseByTag({
    owner: owner,
    repo: repo,
    tag,
  })

  const schemaAsset = findAsset(SCHEMA_FILE, release.data)
  const releaseNotesAsset = findAsset(RELEASE_NOTES, release.data)
  const examplesAsset = findAsset(EXAMPLES_FILE, release.data)

  const releaseNotes = await getReleaseNotes(releaseNotesAsset, ignoredScopes)

  if (!releaseNotes.length) {
    console.info('No changes found')
    return
  }

  const schema = await downloadAsset(schemaAsset.browser_download_url)
  fs.writeFileSync(schemaPath, schema)

  const examplesZip = await downloadAsset(examplesAsset.browser_download_url)
  const examples = await unzipper.Open.buffer(examplesZip)

  // Empty examples directory
  if (fs.existsSync(examplesPath)) {
    console.info(`Cleaning ${examplesPath}`)
    fs.rmSync(examplesPath, { recursive: true, force: true })
  }

  fs.mkdirSync(examplesPath)

  console.info('Writing examples')
  await Promise.all(
    examples.files.map(async (file) => {
      if (file.type === 'Directory') {
        if (file.path !== EXAMPLE_PATH_TO_REPLACE) {
          const dirPath = path.join(examplesPath, file.path.replace(EXAMPLE_PATH_TO_REPLACE, ''))

          try {
            fs.mkdirSync(dirPath)
          } catch (e) {
            console.error(`failed to create directory ${dirPath}`, e)
          }
        }

        return
      }

      const filePath = path.join(examplesPath, file.path.replace(EXAMPLE_PATH_TO_REPLACE, ''))

      try {
        fs.writeFileSync(filePath, await file.buffer())
      } catch (e) {
        console.error(`failed to write file ${filePath}`, e)
      }
    })
  )
  console.info('Examples written')

  console.info('Generating code')
  cp.execSync(generateCommand, {
    stdio: 'pipe',
  })
  console.info('Code generated')

  console.info('Generating changesets')

  if (preRelease) {
    startPreRelease()
  }

  const VERSION_MAP = {
    features: 'minor',
    'bug-fixes': 'patch',
    'breaking-changes': 'major',
    'build-system': 'patch',
  } as const

  const changesetsFiles: string[] = []

  for (const changesGroup of releaseNotes) {
    const version = VERSION_MAP[changesGroup.type as keyof typeof VERSION_MAP]
    if (!version) {
      continue
    }

    for (const note of changesGroup.notes) {
      const changeset = createChangeset(packageJson.name, version, note.note)
      const changesetName = `${changesGroup.type}${note.note}`
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .concat('.md')

      const fileName = path.join(CHANGESETS_PATH, changesetName)
      fs.writeFileSync(fileName, changeset)

      changesetsFiles.push(changesetName)
    }
  }

  if (preRelease) {
    addPreReleaseNotes(changesetsFiles)
  }

  console.info('Changesets generated')
}

main().catch((err) => {
  core.setFailed(err)
})

import { Octokit } from '@octokit/rest'

import fs from 'fs'
import unzipper from 'unzipper'
import path from 'path'
import cp from 'child_process'
import core from '@actions/core'

const OWNER = process.env.GITHUB_OWNER || 'fingerprintjs'
const REPO = process.env.GITHUB_REPO || 'fingerprint-pro-server-api-openapi'
const SCHEMA_FILE = 'fingerprint-server-api-schema-for-sdks.yaml'
const RELEASE_NOTES = 'release-notes.json'
const EXAMPLES_FILE = 'examples.zip'
const EXAMPLE_PATH_TO_REPLACE = 'examples/'
const CHANGESETS_PATH = '.changeset'

type Release = Awaited<ReturnType<Octokit['repos']['getReleaseByTag']>>['data']

function findAsset(name: string, release: Release) {
  const result = release.assets.find((asset) => asset.name === name)

  if (!result) {
    throw new Error(`Cannot find ${name} in the release`)
  }

  return result
}

function createChangeset(project: string, version: string, description: string) {
  return `
---
'${project}': ${version}
---

${description}

  `.trim()
}

async function downloadAsset(url: string) {
  const response = await fetch(url)

  return Buffer.from(await response.arrayBuffer())
}

async function main() {
  const packageJson = JSON.parse(fs.readFileSync(path.join('./package.json'), 'utf-8'))

  const schemaPath = core.getInput('schemaPath')
  const examplesPath = core.getInput('examplesPath')
  const generateCommand = core.getInput('generateCommand')
  const tag = core.getInput('tag')
  const githubToken = core.getInput('githubToken')

  const octokit = new Octokit({ auth: githubToken })

  const release = await octokit.repos.getReleaseByTag({
    owner: OWNER,
    repo: REPO,
    tag,
  })

  const schemaAsset = findAsset(SCHEMA_FILE, release.data)
  const releaseNotesAsset = findAsset(RELEASE_NOTES, release.data)
  const examplesAsset = findAsset(EXAMPLES_FILE, release.data)

  const releaseNotes: Array<{
    type: string
    notes: Array<{ note: string }>
  }> = JSON.parse((await downloadAsset(releaseNotesAsset.browser_download_url)).toString('utf-8'))

  // Update schema file
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
  const VERSION_MAP = {
    features: 'minor',
    'bug-fixes': 'patch',
    'breaking-changes': 'major',
    'build-system': 'patch',
  } as const

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
    }
  }
  console.info('Changesets generated')
}

main().catch((err) => {
  core.setFailed(err)
})

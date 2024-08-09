import { Octokit } from '@octokit/rest'
import * as fs from 'fs'
import unzipper from 'unzipper'
import * as path from 'path'
import { createChangeset } from './changeset.mjs'
import * as cp from 'child_process'

const OWNER = process.env.GITHUB_OWNER || 'fingerprintjs'
const REPO = process.env.GITHUB_REPO || 'fingerprint-pro-server-api-openapi'
const SCHEMA_FILE = 'fingerprint-server-api-schema-for-sdks.yaml'
const RELEASE_NOTES = 'release-notes.json'
const EXAMPLES_FILE = 'examples.zip'
const EXAMPLE_PATH_TO_REPLACE = 'examples/'
const CHANGESETS_PATH = '.changeset'

function findAsset(name) {
  const result = release.data.assets.find((asset) => asset.name === name)

  if (!result) {
    throw new Error(`Cannot find ${name} in the release`)
  }

  return result
}

async function downloadAsset(url) {
  const response = await fetch(url)

  return Buffer.from(await response.arrayBuffer())
}

const packageJson = JSON.parse(fs.readFileSync(path.join('./package.json'), 'utf-8'))

const args = process.argv.slice(2)
console.info('args', args)
const [schemaPath, examplesPath, generateCommand, tag, githubToken] = args

const octokit = new Octokit({ auth: githubToken })

const release = await octokit.repos.getReleaseByTag({
  owner: OWNER,
  repo: REPO,
  tag,
})

const schemaAsset = findAsset(SCHEMA_FILE)
const releaseNotesAsset = findAsset(RELEASE_NOTES)
const examplesAsset = findAsset(EXAMPLES_FILE)

/**
 * @type {
 *   Array<{
 *     type: string
 *     notes: Array<{note: string}>
 *   }>
 * }
 * */
const releaseNotes = JSON.parse((await downloadAsset(releaseNotesAsset.browser_download_url)).toString('utf-8'))

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
}

for (const changesGroup of releaseNotes) {
  const version = VERSION_MAP[changesGroup.type]
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

console.info('Commiting schema changes')
cp.execSync(`git add ${schemaPath}`)
cp.execSync(`git add ${examplesPath}`)
cp.execSync(`git add ${CHANGESETS_PATH}`)
cp.execSync('git commit -m "chore: update schema"')
console.info('Changes commited')

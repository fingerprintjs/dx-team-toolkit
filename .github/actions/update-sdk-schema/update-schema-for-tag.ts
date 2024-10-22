import { Config } from './config'
import { downloadAsset, findAsset, getReleaseNotes, GitHubClient } from './github'
import {
  CHANGESETS_PATH,
  EXAMPLE_PATH_TO_REPLACE,
  EXAMPLES_FILE,
  RELEASE_NOTES,
  SCHEMA_FILE,
  SCOPES_FILE,
} from './const'
import * as fs from 'fs'
import * as unzipper from 'unzipper'
import * as path from 'path'
import * as cp from 'child_process'
import { filterSchema } from './filter-schema'
import { loadScopes } from './scopes'
import { withRetry } from './retry'

export async function updateSchemaForTag(
  tag: string,
  octokit: GitHubClient,
  packageName: string,
  { schemaPath, examplesPath, repo, owner, allowedScopes, generateCommand }: Config,
  cwd = process.cwd()
) {
  examplesPath = path.join(cwd, examplesPath)
  schemaPath = path.join(cwd, schemaPath)

  console.info('Updating schema for tag:', tag)
  const release = await withRetry(() =>
    octokit.rest.repos.getReleaseByTag({
      owner: owner,
      repo: repo,
      tag,
    })
  ).catch((e) => {
    console.error('Failed to get release', e)

    throw e
  })
  const schemaAsset = findAsset(SCHEMA_FILE, release.data)
  const releaseNotesAsset = findAsset(RELEASE_NOTES, release.data)
  const examplesAsset = findAsset(EXAMPLES_FILE, release.data)
  const scopesAsset = findAsset(SCOPES_FILE, release.data)

  const changesets = await getReleaseNotes(releaseNotesAsset, allowedScopes, packageName).catch((e) => {
    console.error('Failed to get release notes', e)

    throw e
  })

  if (!changesets.size) {
    console.info('No changes found')
    return
  }

  const schema = await downloadAsset(schemaAsset.browser_download_url)
  const scopes = await downloadAsset(scopesAsset.browser_download_url)
  const filteredSchema = filterSchema(schema.toString(), loadScopes(scopes.toString()), allowedScopes)
  console.info(`Writing schema (${tag}):\n`, filteredSchema)
  fs.writeFileSync(schemaPath, filteredSchema)
  console.info('Schema written in', schemaPath)

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
    cwd,
  })
  console.info('Code generated')

  console.info('Generating changesets')

  for (const [fileName, changeset] of changesets) {
    const filePath = path.join(cwd, CHANGESETS_PATH, fileName)

    fs.writeFileSync(filePath, changeset)
  }
}

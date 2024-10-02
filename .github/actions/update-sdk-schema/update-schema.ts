import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import { getOctokit } from '@actions/github'
import { startPreRelease } from './changesets'
import { getConfig } from './config'
import { updateSchemaForTag } from './update-schema-for-tag'
import { getLatestSchemaVersion, writeSchemaVersion } from './schema-version'
import { listReleasesBetween } from './github'

async function main() {
  const packageJson = JSON.parse(fs.readFileSync(path.join('./package.json'), 'utf-8'))

  const config = getConfig()
  const tag = core.getInput('tag')

  if (config.preRelease) {
    const preReleaseTag = core.getInput('preReleaseTag')
    startPreRelease(preReleaseTag)
  }

  const octokit = getOctokit(config.githubToken)
  const schemaVersion = getLatestSchemaVersion()

  if (!schemaVersion) {
    await updateSchemaForTag(tag, octokit, packageJson.name, config)
  } else {
    const releases = await listReleasesBetween(octokit, config, schemaVersion, tag)

    for (const release of releases) {
      await updateSchemaForTag(release.tag_name, octokit, packageJson.name, config)
    }
  }

  writeSchemaVersion(tag)
}

main().catch((err) => {
  core.setFailed(err)
})

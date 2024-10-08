import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import { getOctokit } from '@actions/github'
import { startPreRelease } from './changesets'
import { Config, getConfig } from './config'
import { updateSchemaForTag } from './update-schema-for-tag'
import { getLatestSchemaVersion, writeSchemaVersion } from './schema-version'
import { listReleasesBetween } from './github'

interface UpdateSchemaParams {
  config: Config
  tag: string
  packageName: string
  preReleaseTag?: string
  cwd: string
}

export async function updateSchema({ config, tag, packageName, preReleaseTag = 'test', cwd }: UpdateSchemaParams) {
  if (config.preRelease) {
    startPreRelease(preReleaseTag)
  }

  const octokit = getOctokit(config.githubToken)
  // v1.0.0 is the first OpenAPI release that was created
  const schemaVersion = getLatestSchemaVersion() ?? 'v1.0.0'
  const releases = await listReleasesBetween({ octokit, config, fromTag: schemaVersion, toTag: tag })

  for (const release of releases) {
    await updateSchemaForTag(release.tag_name, octokit, packageName, config, cwd)
  }

  writeSchemaVersion(tag, cwd)
}

async function main() {
  try {
    const config = getConfig()
    const tag = core.getInput('tag')
    const packageJson = JSON.parse(fs.readFileSync(path.join('./package.json'), 'utf-8'))
    const preReleaseTag = core.getInput('preReleaseTag')

    await updateSchema({ config, tag, packageName: packageJson.name, preReleaseTag, cwd: process.cwd() })
  } catch (err) {
    core.setFailed(err as Error)
  }
}

main()

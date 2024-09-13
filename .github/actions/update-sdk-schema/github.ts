import { Octokit } from '@octokit/rest'
import * as unzipper from 'unzipper'
import { getChangesetScope, replacePackageName } from './changesets'
import * as path from 'path'
import * as semver from 'semver'
import { getOctokit } from '@actions/github'
import { Config } from './config'

export type GitHubClient = ReturnType<typeof getOctokit>

type Release = Awaited<ReturnType<Octokit['repos']['getReleaseByTag']>>['data']
type ReleaseAsset = Release['assets'][number]

export function findAsset(name: string, release: Release) {
  const result = release.assets.find((asset) => asset.name === name)

  if (!result) {
    throw new Error(`Cannot find ${name} in the release`)
  }

  return result
}

export async function downloadAsset(url: string) {
  const response = await fetch(url)

  return Buffer.from(await response.arrayBuffer())
}

/**
 * Lists releases between given tags
 * It is worth noting that for `fromTag` we perform `gt` comparison, while for `toTag` we perform `lte`
 * */
export async function listReleasesBetween(
  octokit: GitHubClient,
  config: Pick<Config, 'owner' | 'repo'>,
  fromTag: string,
  toTag: string
) {
  const releases: Release[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const { data } = await octokit.rest.repos.listReleases({
      owner: config.owner,
      repo: config.repo,
      per_page: perPage,
      page,
    })

    data.forEach((release) => {
      if (semver.gt(release.tag_name, fromTag) && semver.lte(release.tag_name, toTag)) {
        console.info(`Found ${release.tag_name}`)
        releases.push(release)
      }
    })

    if (data.length < perPage) {
      break
    }

    page++
  }

  console.info(`Found ${releases.length} releases that match following criteria: from ${fromTag} to ${toTag}`)

  return releases
}

export async function getReleaseNotes(
  releaseNotesAsset: ReleaseAsset,
  allowedScopes: string[],
  packageName: string
): Promise<Map<string, string>> {
  // Map of changeset file name and contents
  const changesets = new Map<string, string>()

  const releaseNotesZip = await downloadAsset(releaseNotesAsset.browser_download_url)
  const contents = await unzipper.Open.buffer(releaseNotesZip)

  for (const file of contents.files) {
    const content = await file.buffer()
    const str = content.toString('utf-8')
    const scope = getChangesetScope(str)

    if (!scope || !allowedScopes.length || allowedScopes.includes(scope)) {
      const fileName = path.basename(file.path)

      changesets.set(fileName, replacePackageName(str, packageName))
    }
  }

  return changesets
}

import { Octokit } from '@octokit/rest'
import * as unzipper from 'unzipper'
import { getChangesetScope, replacePackageName } from './changesets'
import * as path from 'path'
import * as semver from 'semver'
import { getOctokit } from '@actions/github'
import { Config } from './config'
import { withRetry } from './retry'

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
  try {
    console.info('Downloading asset:', url)
    const response = await withRetry(() => fetch(url))

    return Buffer.from(await response.arrayBuffer())
  } catch (e) {
    console.error(`Failed to download asset: ${url}`, e)

    throw e
  }
}

interface ListReleasesBetweenParams {
  octokit: GitHubClient
  config: Pick<Config, 'owner' | 'repo'>
  fromTag: string
  toTag: string
}

interface GetReleaseParams {
  tag: string
  octokit: GitHubClient
  config: Pick<Config, 'owner' | 'repo'>
}

export async function getRelease({ config, tag, octokit }: GetReleaseParams): Promise<Release> {
  const { data } = await withRetry(() =>
    octokit.rest.repos.getReleaseByTag({
      owner: config.owner,
      repo: config.repo,
      tag,
    })
  )

  return data
}

/**
 * Lists releases between given tags
 * It is worth noting that for `fromTag` we perform `gt` comparison, while for `toTag` we perform `lte`
 * */
export async function listReleasesBetween({ octokit, config, fromTag, toTag }: ListReleasesBetweenParams) {
  const releases: Release[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const { data } = await withRetry(() =>
      octokit.rest.repos.listReleases({
        owner: config.owner,
        repo: config.repo,
        per_page: perPage,
        page,
      })
    )

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

  // Sort releases in ascending order
  return releases.sort((a, b) => (semver.gt(a.tag_name, b.tag_name) ? 1 : -1))
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

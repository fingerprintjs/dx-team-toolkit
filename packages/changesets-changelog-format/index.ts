import { ChangelogFunctions, NewChangesetWithCommit } from '@changesets/types'
import { ModCompWithPackage } from '@changesets/types/src'

function getCommitLink(sha: string, repo: string) {
  return `[${sha.slice(0, 7)}](https://github.com/${repo}/commit/${sha})`
}

async function getReleaseLine(
  changeset: NewChangesetWithCommit,
  _versionType: unknown,
  options: null | Record<string, any>
): Promise<string> {
  if (!options?.repo) {
    throw new TypeError('Missing `options.repo`')
  }

  const [firstLine, ...futureLines] = changeset.summary.split('\n').map((l) => l.trimEnd())

  let returnVal = `- ${firstLine}`

  if (futureLines.length > 0) {
    returnVal += `\n${futureLines.map((l) => `  ${l}`).join('\n')}`
  }

  if (changeset.commit) {
    const link = getCommitLink(changeset.commit, options.repo)
    returnVal += ` (${link})`
  }

  return returnVal
}

async function getDependencyReleaseLine(
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[]
): Promise<string> {
  if (dependenciesUpdated.length === 0) {
    return ''
  }

  const changesetLinks = changesets.map(
    (changeset) => `- Updated dependencies${changeset.commit ? ` [${changeset.commit.slice(0, 7)}]` : ''}`
  )

  const updatedDependenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  )

  return [...changesetLinks, ...updatedDependenciesList].join('\n')
}

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
}

export default defaultChangelogFunctions

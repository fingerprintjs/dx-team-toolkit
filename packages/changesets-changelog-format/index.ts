import { ChangelogFunctions, NewChangesetWithCommit } from '@changesets/types'
import { ModCompWithPackage } from '@changesets/types/src'

async function getReleaseLine(changeset: NewChangesetWithCommit): Promise<string> {
  const [firstLine, ...futureLines] = changeset.summary.split('\n').map((l) => l.trimEnd())

  let returnVal = `- ${firstLine}`

  if (futureLines.length > 0) {
    returnVal += `\n${futureLines.map((l) => `  ${l}`).join('\n')}`
  }

  if (changeset.commit) {
    returnVal += ` (${changeset.commit.slice(0, 7)})`
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

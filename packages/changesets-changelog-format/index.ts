import { ChangelogFunctions, NewChangesetWithCommit, VersionType } from '@changesets/types'
import { ModCompWithPackage } from '@changesets/types/src'

async function getReleaseLine(changeset: NewChangesetWithCommit, type: VersionType): Promise<string> {}

async function getDependencyReleaseLine(
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[]
): Promise<string> {}

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
}

export default defaultChangelogFunctions

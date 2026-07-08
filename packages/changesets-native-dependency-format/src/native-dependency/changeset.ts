import getReleasePlan from '@changesets/get-release-plan'

export function getChangesetStatus() {
  return getReleasePlan(process.cwd())
}

// Order in which change types appear as last in the changelog
// We use it to find the changeset that appears last in the changelog and append native deps note to it, so that it always appears last
const changeTypesOrder = ['patch', 'minor', 'major']

export async function getPendingChangesets(packageName: string) {
  const changesetStatus = await getChangesetStatus()

  const changesets = changesetStatus.releases.find((release) => release.name === packageName)?.changesets ?? []

  return changesets.map((changesetName) => {
    const changeset = changesetStatus.changesets.find((c) => c.id === changesetName)

    return {
      id: changesetName,
      type: changeset?.releases?.find((r) => r.name === packageName)?.type,
    }
  })
}

export function getLastChangeset(packageName: string) {
  return getPendingChangesets(packageName).then((changesets) => {
    for (const type of changeTypesOrder) {
      const changeset = changesets.find((c) => c.type === type)

      if (changeset) {
        return changeset.id
      }
    }

    return undefined
  })
}

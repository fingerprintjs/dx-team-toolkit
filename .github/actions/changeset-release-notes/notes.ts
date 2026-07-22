import { NewChangeset } from '@changesets/types'
import { listChangesForAllProjects } from './changelog.ts'

export function getReleaseNotes(changesets: NewChangeset[], cwd = process.cwd()) {
  let result = ''

  const changes = listChangesForAllProjects(changesets, cwd)

  changes.forEach((change) => {
    result += `## ${change.projectName}@${change.currentVersion}\n\n`
    result += `${change.changes}\n\n`
  })

  return result
}

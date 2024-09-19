import { NewChangeset } from '@changesets/types'
import { listChangesForAllProjects } from './changelog'

export function getReleaseNotes(changesets: NewChangeset[]) {
  let result = ''

  const changes = listChangesForAllProjects(changesets)

  changes.forEach((change) => {
    result += `## ${change.projectName}@${change.currentVersion}\n\n`

    change.changes.forEach((change) => {
      result += `### ${change.type}`

      change.changes.forEach((description) => {
        result += `\n- ${description}`
      })
    })
  })

  return result
}

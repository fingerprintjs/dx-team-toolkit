import readChangesets from '@changesets/read'
import { getReleaseNotes } from './notes.ts'
import { listProjects } from './changelog.ts'
import { doVersion } from './version.ts'

export async function changesetReleaseNotes(cwd = process.cwd()) {
  const changesets = await readChangesets(cwd)
  if (!changesets.length) {
    return
  }

  console.info('Found changesets', JSON.stringify(changesets, null, 2))

  const projects = Array.from(listProjects(changesets, cwd).values())
  console.info('Found projects', JSON.stringify(projects, null, 2))

  if (!doVersion(projects, cwd)) {
    console.info('No changes found for all projects')
    return
  }

  console.info('Changelogs generated successfully')

  return getReleaseNotes(changesets, cwd)
}

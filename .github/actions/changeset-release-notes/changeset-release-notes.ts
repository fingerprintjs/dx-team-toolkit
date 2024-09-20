import * as core from '@actions/core'
import readChangesets from '@changesets/read'
import { getReleaseNotes } from './notes'
import { listProjects } from './changelog'
import { doVersion } from './version'

async function main() {
  const changesets = await readChangesets(process.cwd())
  if (!changesets.length) {
    return
  }

  console.info('Found changesets', JSON.stringify(changesets, null, 2))

  const projects = Array.from(listProjects(changesets).values())
  console.info('Found projects', JSON.stringify(projects, null, 2))

  if (!doVersion(projects)) {
    console.info('No changes found for all projects')
    return
  }

  console.info('Changelogs generated successfully')

  const notes = getReleaseNotes(changesets)

  if (notes) {
    core.setOutput('release-notes', notes)
  }
}

main().catch((err) => {
  core.setFailed(err)
})

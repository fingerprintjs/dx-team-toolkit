import * as fs from 'fs'
import * as path from 'path'
import { PackageJSON } from '@changesets/types'
import * as core from '@actions/core'
import * as cp from 'child_process'
import readChangesets from '@changesets/read'
import { getReleaseNotes } from './notes'
import { listProjects, Project } from './changelog'

function getCurrentVersion(project: Project) {
  const pkg = JSON.parse(fs.readFileSync(path.join(project.rootPath, 'package.json'), 'utf-8'))

  return (pkg as PackageJSON).version
}

function doVersion(projects: Project[]) {
  const oldVersions = projects.map((project) => getCurrentVersion(project))
  cp.execSync('pnpm exec changeset version')

  return projects.some((project, i) => {
    const lastVersion = oldVersions[i]
    const nextVersion = getCurrentVersion(project)

    return lastVersion !== nextVersion
  })
}

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

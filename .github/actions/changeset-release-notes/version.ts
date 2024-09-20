import { Project } from './changelog'
import fs from 'fs'
import path from 'path'
import { PackageJSON } from '@changesets/types'
import cp from 'child_process'

function getCurrentVersion(project: Project) {
  const pkg = JSON.parse(fs.readFileSync(path.join(project.rootPath, 'package.json'), 'utf-8'))

  return (pkg as PackageJSON).version
}

export function doVersion(projects: Project[]) {
  const oldVersions = projects.map((project) => getCurrentVersion(project))
  cp.execSync('pnpm exec changeset version')

  return projects.some((project, i) => {
    const lastVersion = oldVersions[i]
    const nextVersion = getCurrentVersion(project)

    return lastVersion !== nextVersion
  })
}

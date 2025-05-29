import { Project } from './changelog'
import * as fs from 'fs'
import * as path from 'path'
import { PackageJSON } from '@changesets/types'
import * as cp from 'child_process'

function getCurrentVersion(project: Project) {
  const pkg = JSON.parse(fs.readFileSync(path.join(project.rootPath, 'package.json'), 'utf-8'))

  return (pkg as PackageJSON).version
}

export function doVersion(projects: Project[], cwd = process.cwd()) {
  const oldVersions = projects.map((project) => getCurrentVersion(project))
  
  console.info('Updating version')
  
  cp.execSync('pnpm exec changeset version', {
    cwd,
    stdio: 'inherit'
  })
  
  console.info('Version updated')

  return projects.some((project, i) => {
    const lastVersion = oldVersions[i]
    const nextVersion = getCurrentVersion(project)

    return lastVersion !== nextVersion
  })
}

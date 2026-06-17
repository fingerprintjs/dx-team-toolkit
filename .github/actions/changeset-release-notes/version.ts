import { Project } from './changelog'
import * as fs from 'fs'
import * as path from 'path'
import { PackageJSON } from '@changesets/types'
import * as cp from 'child_process'

function getCurrentVersion(project: Project) {
  const pkg: PackageJSON = JSON.parse(fs.readFileSync(path.join(project.rootPath, 'package.json'), 'utf-8'))

  return pkg.version
}

function detectPackageManager(cwd: string): 'yarn' | 'pnpm' {
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn'
  }
  return 'pnpm'
}

export function doVersion(projects: Project[], cwd = process.cwd()) {
  const oldVersions = projects.map((project) => getCurrentVersion(project))

  const packageManager = detectPackageManager(cwd)
  console.info(`Updating version using ${packageManager}`)

  const command = packageManager === 'yarn' ? 'yarn changeset version' : 'pnpm exec changeset version'

  cp.execSync(command, {
    cwd,
    stdio: 'inherit',
  })

  console.info('Version updated')

  return projects.some((project, i) => {
    const lastVersion = oldVersions[i]
    const nextVersion = getCurrentVersion(project)

    return lastVersion !== nextVersion
  })
}

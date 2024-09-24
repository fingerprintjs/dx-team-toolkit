import { NewChangeset, PackageJSON } from '@changesets/types'
import { sync as globSync } from 'glob'
import * as fs from 'fs'
import * as path from 'path'

export type Project = {
  version: string
  changelogPath: string
  rootPath: string
}

export type ReleaseNotes = {
  projectName: string
  changes: string
  currentVersion: string
}

export function listProjects(changesets: NewChangeset[], cwd = process.cwd()) {
  const ids = new Set<string>(
    ...changesets.map((c) => {
      return c.releases.map((r) => {
        return r.name
      })
    })
  )
  console.info('Project names', Array.from(ids))
  const packageJsons = globSync('**/package.json', {
    ignore: ['**/node_modules/**'],
    cwd,
  })
  console.info('Packages', packageJsons)

  const projects = new Map<string, Project>()

  packageJsons.forEach((packageJsonPath) => {
    try {
      packageJsonPath = path.join(cwd, packageJsonPath)

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageJSON
      if (!ids.has(packageJson.name)) {
        return
      }

      console.info(`Found ${packageJson.name} in ${packageJsonPath}`)

      const rootPath = path.dirname(packageJsonPath)
      const changelogPath = path.join(rootPath, 'CHANGELOG.md')

      projects.set(packageJson.name, {
        version: packageJson.version,
        changelogPath: changelogPath,
        rootPath,
      })
    } catch (e) {
      console.error(`Failed to get project info for ${packageJsonPath}`, e)
    }
  })

  return projects
}

export function listChangesForAllProjects(changesets: NewChangeset[], cwd = process.cwd()) {
  const notes: ReleaseNotes[] = []

  const changelogs = listProjects(changesets, cwd)

  changelogs.forEach((project, projectName) => {
    const changelog = fs.readFileSync(project.changelogPath, 'utf-8')
    notes.push({
      changes: getChangesForVersion(project.version, changelog),
      projectName: projectName,
      currentVersion: project.version,
    })
  })

  return notes
}

export function getChangesForVersion(version: string, changelog: string): string {
  // Split the changelog into lines for easier processing
  const lines = changelog.split('\n')

  let currentVersion = ''
  let changes: string = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Check for a version line (e.g., "## 1.1.0")
    const versionMatch = trimmedLine.match(/^## (\d+\.\d+\.\d+.*)/)
    if (versionMatch) {
      currentVersion = versionMatch[1]
      // If the current version matches the requested version, continue processing
      if (currentVersion === version) {
        continue
      } else if (changes.length > 0) {
        // If we've already collected changes for the desired version, break the loop
        break
      }
    }

    if (currentVersion === version) {
      changes += `${line}\n`
    }
  }

  return changes
}

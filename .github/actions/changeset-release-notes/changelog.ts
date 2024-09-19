import { NewChangeset, PackageJSON } from '@changesets/types'
import { sync as globSync } from 'glob'
import * as fs from 'fs'
import * as path from 'path'

export type ChangeLogEntry = {
  version: string
  changes: string[]
}

type Project = {
  version: string
  changelogPath: string
}

export type ReleaseNotes = {
  projectName: string
  changes: Changes[]
  currentVersion: string
}

function listProjects(changesets: NewChangeset[]) {
  const ids = new Set<string>(...changesets.map((c) => c.id))
  const packageJsons = globSync('**/package.json', {
    ignore: ['**/node_modules/**'],
  })

  const projects = new Map<string, Project>()

  packageJsons.forEach((packageJsonPath) => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageJSON
    if (!ids.has(packageJson.name)) {
      return
    }

    const changelogPath = path.join(path.dirname(packageJsonPath), 'CHANGELOG.md')
    if (fs.existsSync(changelogPath)) {
      projects.set(packageJson.name, {
        version: packageJson.version,
        changelogPath: changelogPath,
      })
    }
  })

  return projects
}

export function listChangesForAllProjects(changesets: NewChangeset[]) {
  const notes: ReleaseNotes[] = []

  const changelogs = listProjects(changesets)

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

export type Changes = { type: string; changes: string[] }

export function getChangesForVersion(version: string, changelog: string): Changes[] {
  // Split the changelog into lines for easier processing
  const lines = changelog.split('\n')

  // Initialize variables to track the current version and changes
  let currentVersion = ''
  let changeType = ''
  const changes: Changes[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Check for a version line (e.g., "## 1.1.0")
    const versionMatch = line.match(/^## (\d+\.\d+\.\d+)/)
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

    // Check for a change type line (e.g., "### Minor Changes")
    if (currentVersion === version && line.startsWith('###')) {
      changeType = line.replace(/^###\s*/, '')
      changes.push({ type: changeType, changes: [] })
    }

    // Collect changes under the current change type
    if (currentVersion === version && line.startsWith('-')) {
      // Add the change to the last changeType entry
      changes[changes.length - 1].changes.push(line.slice(2).trim())
    }
  }

  return changes
}

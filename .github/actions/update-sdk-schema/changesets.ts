import * as cp from 'child_process'
import * as fs from 'fs'

const PRE_JSON_PATH = '.changeset/pre.json'

export function startPreRelease(tag: string) {
  if (fs.existsSync(PRE_JSON_PATH)) {
    console.info('Pre release already started')

    return
  }

  cp.execSync(`pnpm exec changeset pre enter ${tag}`, { stdio: 'inherit' })
}

export function getChangesetScope(changeset: string) {
  const regex = /\*\*(\w.+)\*\*:/

  const matches = regex.exec(changeset)

  if (matches?.[1]) {
    return matches[1]
  }

  return null
}

export function replacePackageName(changeset: string, name: string) {
  // Match either single or double-quoted package name
  const regex = /---\n['"](.*)['"]:/
  const match = regex.exec(changeset)

  if (!match) {
    return changeset
  }

  return changeset.replace(match[1], name)
}

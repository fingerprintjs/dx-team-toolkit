import * as cp from 'child_process'
import * as fs from 'fs'

const PRE_JSON_PATH = '.changeset/pre.json'

export function startPreRelease() {
  if (fs.existsSync(PRE_JSON_PATH)) {
    console.info('Pre release already started')

    return
  }

  cp.execSync('changeset pre enter test', { stdio: 'inherit' })
}

export function addPreReleaseNotes(changesetsFileNames: string[]) {
  if (!fs.existsSync(PRE_JSON_PATH)) {
    console.warn('Pre release not started')

    return
  }

  const contents = JSON.parse(fs.readFileSync(PRE_JSON_PATH, 'utf-8')) as {
    changesets?: string[]
  }

  if (!Array.isArray(contents.changesets)) {
    contents.changesets = []
  }

  contents.changesets.push(...changesetsFileNames.map((note) => note.replace('.md', '')))

  console.info('writing pre.json', contents)

  fs.writeFileSync(PRE_JSON_PATH, JSON.stringify(contents, null, 2))
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
  const regex = /---\n'(.*)':/
  const match = regex.exec(changeset)

  if (!match) {
    return changeset
  }

  return changeset.replace(match[1], name)
}

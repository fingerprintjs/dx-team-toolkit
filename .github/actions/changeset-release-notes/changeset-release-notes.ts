import * as fs from 'fs'
import * as path from 'path'
import { PackageJSON } from '@changesets/types'
import * as core from '@actions/core'
import * as cp from 'child_process'
import readChangesets from '@changesets/read'
import { getReleaseNotes } from './notes'

function getCurrentVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'))

  return (pkg as PackageJSON).version
}

function doVersion() {
  const lastVersion = getCurrentVersion()
  cp.execSync('pnpm exec changeset version')
  const nextVersion = getCurrentVersion()

  return lastVersion !== nextVersion
}

async function main() {
  const changesets = await readChangesets(process.cwd())
  if (!changesets.length) {
    return
  }

  if (!doVersion()) {
    return
  }

  const notes = getReleaseNotes(changesets)

  if (notes) {
    core.setOutput('release-notes', notes)
  }
}

main().catch((err) => {
  core.setFailed(err)
})

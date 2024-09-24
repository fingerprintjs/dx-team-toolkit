import * as path from 'path'
import humanId from 'human-id'
import * as fs from 'fs'
import { PackageJSON } from '@changesets/types'
import * as pkg from '../../package.json'
import { TEST_PACKAGE_PATH, testPkgExec } from './testPkgExec'

function doCommit(message: string) {
  testPkgExec(`git add . && git commit -m "${message}"`)

  const result = testPkgExec('git rev-parse HEAD').toString('utf-8').trim()

  return {
    long: result,
    short: result.slice(0, 7),
  }
}

export function startPreRelease() {
  testPkgExec('pnpm exec changeset pre enter test')
}

export function initTestPackage(withChangelogPreset = true) {
  if (fs.existsSync(TEST_PACKAGE_PATH)) {
    fs.rmSync(TEST_PACKAGE_PATH, { recursive: true })
  }

  fs.mkdirSync(TEST_PACKAGE_PATH)

  testPkgExec('pnpm init')
  testPkgExec('changeset init')

  if (withChangelogPreset) {
    const changesetConfigPath = path.join(TEST_PACKAGE_PATH, '.changeset/config.json')
    const changesetConfig = JSON.parse(fs.readFileSync(changesetConfigPath, 'utf-8'))
    changesetConfig.changelog = [
      path.join(__dirname, 'dist/index.js'),
      {
        repo: 'test-owner/test-repo',
      },
    ]
    fs.writeFileSync(changesetConfigPath, JSON.stringify(changesetConfig, null, 2))
  }

  const testPkgJson = JSON.parse(fs.readFileSync(path.join(TEST_PACKAGE_PATH, 'package.json'), 'utf-8')) as PackageJSON

  testPkgJson.dependencies = {
    '@changesets/cli': pkg.devDependencies['@changesets/cli'],
  }

  fs.writeFileSync(path.join(TEST_PACKAGE_PATH, 'package.json'), JSON.stringify(testPkgJson, null, 2))

  testPkgExec('pnpm install')

  testPkgExec('git init')

  doCommit('chore: init')
}

export function addChangeset(description: string, version: 'patch' | 'minor' | 'major') {
  const changeset = `
---
'test-pkg': ${version}
---

${description}

  `.trim()

  const name = `${humanId({
    capitalize: false,
    separator: '-',
  })}.md`

  fs.writeFileSync(path.join(TEST_PACKAGE_PATH, '.changeset', name), changeset)
  return doCommit('chore: add changeset')
}

export function doVersion() {
  testPkgExec('changeset version')
}

export function readChangelog() {
  return fs.readFileSync(path.join(TEST_PACKAGE_PATH, 'CHANGELOG.md'), 'utf-8')
}

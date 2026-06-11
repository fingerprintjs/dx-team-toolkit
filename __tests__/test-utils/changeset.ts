import * as path from 'path'
import humanId from 'human-id'
import * as fs from 'fs'
import { PackageJSON } from '@changesets/types'
import * as pkg from '../../package.json'
import { createTestPkg } from './testPkgExec'

export function initTestPackage(withChangelogPreset = true) {
  const testPkg = createTestPkg()

  testPkg.exec('pnpm init')
  testPkg.exec('changeset init')

  if (withChangelogPreset) {
    const changesetConfigPath = path.join(testPkg.path, '.changeset/config.json')
    const changesetConfig = JSON.parse(fs.readFileSync(changesetConfigPath, 'utf-8'))
    changesetConfig.changelog = [
      path.resolve(__dirname, '../../packages/changesets-changelog-format/dist/index.js'),
      {
        repo: 'test-owner/test-repo',
      },
    ]
    fs.writeFileSync(changesetConfigPath, JSON.stringify(changesetConfig, null, 2))
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const testPkgJson = JSON.parse(fs.readFileSync(path.join(testPkg.path, 'package.json'), 'utf-8')) as PackageJSON

  testPkgJson.dependencies = {
    '@changesets/cli': pkg.devDependencies['@changesets/cli'],
  }

  fs.writeFileSync(path.join(testPkg.path, 'package.json'), JSON.stringify(testPkgJson, null, 2))

  testPkg.exec('pnpm install')

  testPkg.exec('git init')

  function commit(message: string) {
    testPkg.exec(`git add . && git commit -m "${message}"`)
    const hash = testPkg.exec('git rev-parse HEAD').toString('utf-8').trim()
    return { long: hash, short: hash.slice(0, 7) }
  }

  commit('chore: init')

  return {
    ...testPkg,

    addChangeset(description: string, version: 'patch' | 'minor' | 'major') {
      const changeset = `
---
'${testPkg.name}': ${version}
---

${description}

      `.trim()

      const name = `${humanId({
        capitalize: false,
        separator: '-',
      })}.md`

      fs.writeFileSync(path.join(testPkg.path, '.changeset', name), changeset)
      return commit('chore: add changeset')
    },

    doVersion() {
      testPkg.exec('changeset version')
    },

    readChangelog() {
      return fs.readFileSync(path.join(testPkg.path, 'CHANGELOG.md'), 'utf-8')
    },

    writeChangelog(contents: string) {
      fs.writeFileSync(path.join(testPkg.path, 'CHANGELOG.md'), contents)
    },

    startPreRelease() {
      testPkg.exec('pnpm exec changeset pre enter test')
    },
  }
}

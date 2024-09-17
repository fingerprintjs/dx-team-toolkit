import * as fs from 'fs'
import * as path from 'path'
import * as cp from 'child_process'
import humanId from 'human-id'
import * as pkg from '../../package.json'
import { PackageJSON } from '@changesets/types'
import * as os from 'os'

const TEST_PACKAGE_PATH = path.resolve(os.tmpdir(), 'test-pkg')

function exec(command: string) {
  return cp.execSync(command, { cwd: TEST_PACKAGE_PATH })
}

function doCommit(message: string) {
  const result = exec(`git add . && git commit -m "${message}" && git rev-parse HEAD`).toString('utf-8')

  const branchWithSha = result.match(/\[.*? ([a-f0-9]{7})]/)

  return branchWithSha?.[1]
}

function initTestPackage() {
  if (fs.existsSync(TEST_PACKAGE_PATH)) {
    fs.rmSync(TEST_PACKAGE_PATH, { recursive: true })
  }

  fs.mkdirSync(TEST_PACKAGE_PATH)

  exec('pnpm init')
  exec('changeset init')

  const changesetConfigPath = path.join(TEST_PACKAGE_PATH, '.changeset/config.json')
  const changesetConfig = JSON.parse(fs.readFileSync(changesetConfigPath, 'utf-8'))
  changesetConfig.changelog = path.join(__dirname, 'dist/index.js')
  fs.writeFileSync(changesetConfigPath, JSON.stringify(changesetConfig, null, 2))

  const testPkgJson = JSON.parse(fs.readFileSync(path.join(TEST_PACKAGE_PATH, 'package.json'), 'utf-8')) as PackageJSON

  testPkgJson.dependencies = {
    '@changesets/cli': pkg.devDependencies['@changesets/cli'],
  }

  fs.writeFileSync(path.join(TEST_PACKAGE_PATH, 'package.json'), JSON.stringify(testPkgJson, null, 2))

  exec('pnpm install')

  exec('git init')

  doCommit('chore: init')
}

function addChangeset(description: string, version: 'patch' | 'minor' | 'major') {
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

function doVersion() {
  exec('changeset version')
}

function readChangelog() {
  return fs.readFileSync(path.join(TEST_PACKAGE_PATH, 'CHANGELOG.md'), 'utf-8')
}

describe('Changeset changelog format', () => {
  beforeEach(() => {
    initTestPackage()
  })

  it('with multiple changes', () => {
    const patchSha = addChangeset('**events**: Test fix', 'patch')
    const minorSha = addChangeset('**identification**: New feature', 'minor')
    const majorSha = addChangeset('**visitors**: New major change', 'major')
    doVersion()

    const changelog = readChangelog()

    expect(changelog).toEqual(`# test-pkg

## 2.0.0

### Major Changes

- **visitors**: New major change (${majorSha})

### Minor Changes

- **identification**: New feature (${minorSha})

### Patch Changes

- **events**: Test fix (${patchSha})
`)
  })
})

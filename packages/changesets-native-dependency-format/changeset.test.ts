import * as fs from 'fs'
import * as path from 'path'
import { initTestPackage } from '../../__tests__/test-utils/changeset'
import { getLastChangeset } from './src/native-dependency/changeset'

describe('getLastChangeset', () => {
  let pkg: ReturnType<typeof initTestPackage>

  beforeEach(() => {
    pkg = initTestPackage(false)
    jest.spyOn(process, 'cwd').mockReturnValue(pkg.path)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  function addChangeset(id: string, version: 'patch' | 'minor' | 'major') {
    fs.writeFileSync(path.join(pkg.path, '.changeset', `${id}.md`), `---\n'${pkg.name}': ${version}\n---\n\n${id}\n`)
  }

  it('returns the last of several changesets with the lowest change type', async () => {
    addChangeset('a-major', 'major')
    addChangeset('b-patch', 'patch')
    addChangeset('c-patch', 'patch')

    expect(await getLastChangeset(pkg.name)).toBe('c-patch')
  })

  it('falls back to a higher change type when there are no patches', async () => {
    addChangeset('a-minor', 'minor')
    addChangeset('b-major', 'major')

    expect(await getLastChangeset(pkg.name)).toBe('a-minor')
  })
})

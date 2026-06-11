import { initTestPackage } from '../../__tests__/test-utils/changeset'

describe('Changeset changelog format', () => {
  let pkg: ReturnType<typeof initTestPackage>

  beforeEach(() => {
    pkg = initTestPackage()
  })

  it('with multiple changes', () => {
    const patchSha = pkg.addChangeset('**events**: Test fix', 'patch')
    const minorSha = pkg.addChangeset('**identification**: New feature', 'minor')
    const majorSha = pkg.addChangeset('**visitors**: New major change', 'major')
    pkg.doVersion()

    const changelog = pkg.readChangelog()

    const expected = `# ${pkg.name}

## 2.0.0

### Major Changes

- **visitors**: New major change ([${majorSha.short}](https://github.com/test-owner/test-repo/commit/${majorSha.long}))

### Minor Changes

- **identification**: New feature ([${minorSha.short}](https://github.com/test-owner/test-repo/commit/${minorSha.long}))

### Patch Changes

- **events**: Test fix ([${patchSha.short}](https://github.com/test-owner/test-repo/commit/${patchSha.long}))
`

    expect(changelog).toBe(expected)
  })
})

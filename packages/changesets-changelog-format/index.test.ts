import { addChangeset, doVersion, initTestPackage, readChangelog } from '../../__tests__/test-utils/changeset'
import { TEST_PACKAGE_NAME } from '../../__tests__/test-utils/testPkgExec'

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

    const expected = `# ${TEST_PACKAGE_NAME}

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

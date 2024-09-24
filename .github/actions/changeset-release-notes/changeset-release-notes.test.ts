import { addChangeset, initTestPackage, startPreRelease } from '../../../__tests__/test-utils/changeset'
import { TEST_PACKAGE_NAME, TEST_PACKAGE_PATH } from '../../../__tests__/test-utils/testPkgExec'
import { changesetReleaseNotes } from './changeset-release-notes'

jest.mock('@actions/core')

describe('Changeset release notes', () => {
  beforeEach(() => {
    initTestPackage(false)
  })

  it('preview with multiple changes', async () => {
    const patchSha = addChangeset('**events**: Test fix', 'patch')
    const minorSha = addChangeset('**identification**: New feature', 'minor')
    const majorSha = addChangeset('**visitors**: New major change', 'major')

    const preview = await changesetReleaseNotes(TEST_PACKAGE_PATH)
    expect(preview).toEqual(`## ${TEST_PACKAGE_NAME}@2.0.0


### Major Changes

- ${majorSha.short}: **visitors**: New major change

### Minor Changes

- ${minorSha.short}: **identification**: New feature

### Patch Changes

- ${patchSha.short}: **events**: Test fix



`)
  })

  it('preview with multiple changes in pre-release mode', async () => {
    startPreRelease()

    const patchSha = addChangeset('**events**: Test fix', 'patch')
    const minorSha = addChangeset('**identification**: New feature', 'minor')
    const majorSha = addChangeset('**visitors**: New major change', 'major')

    const preview = await changesetReleaseNotes(TEST_PACKAGE_PATH)
    expect(preview).toEqual(`## ${TEST_PACKAGE_NAME}@2.0.0-test.0


### Major Changes

- ${majorSha.short}: **visitors**: New major change

### Minor Changes

- ${minorSha.short}: **identification**: New feature

### Patch Changes

- ${patchSha.short}: **events**: Test fix



`)
  })
})

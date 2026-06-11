import { initTestPackage } from '../../../__tests__/test-utils/changeset'
import { changesetReleaseNotes } from './changeset-release-notes'

jest.mock('@actions/core')

describe('Changeset release notes', () => {
  let pkg: ReturnType<typeof initTestPackage>

  beforeEach(() => {
    pkg = initTestPackage(false)
  })

  it('preview with changelog containing legacy notes', async () => {
    pkg.writeChangelog(`# {pkg.name}
    
    
## [1.0.0](https://github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/compare/v0.0.0...v1.0.0) (2024-07-30)

### Features

- add velocity, remote control and developer tools smart signals ([a66f05c](https://github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/commit/a66f05cc3b743f3ddf3467bc79afaa9311cf2073))`)

    const patchSha = pkg.addChangeset('**events**: Test fix', 'patch')

    const preview = await changesetReleaseNotes(pkg.path)
    expect(preview).toEqual(`## ${pkg.name}@1.0.1


### Patch Changes

- ${patchSha.short}: **events**: Test fix



`)
  })

  it('preview with multiple changes', async () => {
    const patchSha = pkg.addChangeset('**events**: Test fix', 'patch')
    const minorSha = pkg.addChangeset('**identification**: New feature', 'minor')
    const majorSha = pkg.addChangeset('**visitors**: New major change', 'major')

    const preview = await changesetReleaseNotes(pkg.path)
    expect(preview).toEqual(`## ${pkg.name}@2.0.0


### Major Changes

- ${majorSha.short}: **visitors**: New major change

### Minor Changes

- ${minorSha.short}: **identification**: New feature

### Patch Changes

- ${patchSha.short}: **events**: Test fix



`)
  })

  it('preview with multiple changes in pre-release mode', async () => {
    pkg.startPreRelease()

    const patchSha = pkg.addChangeset('**events**: Test fix', 'patch')
    const minorSha = pkg.addChangeset('**identification**: New feature', 'minor')
    const majorSha = pkg.addChangeset('**visitors**: New major change', 'major')

    const preview = await changesetReleaseNotes(pkg.path)
    expect(preview).toEqual(`## ${pkg.name}@2.0.0-test.0


### Major Changes

- ${majorSha.short}: **visitors**: New major change

### Minor Changes

- ${minorSha.short}: **identification**: New feature

### Patch Changes

- ${patchSha.short}: **events**: Test fix



`)
  })
})

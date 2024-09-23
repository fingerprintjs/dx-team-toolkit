import { getChangesForVersion } from './changelog'

describe('getChangesForVersion', () => {
  it('parse changelog with multiple versions', () => {
    const changelogText = `# fingerprint-pro-server-api-openapi

## 1.1.0

### Minor Changes

- **events**: Introduce \`PUT\` endpoint for \`/events\` API ([e8bc23f](https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/commit/e8bc23f115c3b01f9d0d472b02093d0d05d3f4a5))
- **visits**: Model fixes ([e8bc23f](https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/commit/e8bc23f115c3b01f9d0d472b02093d0d05d3f4a5))

## 1.0.0

### Minor Changes

- Initial release
`

    const result = getChangesForVersion('1.1.0', changelogText)

    expect(result).toMatchSnapshot()
  })
})

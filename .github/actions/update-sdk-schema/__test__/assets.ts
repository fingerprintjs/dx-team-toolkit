import * as path from 'path'
import * as fs from 'fs'

const assetsMap = {
  'https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/releases/download/v1.1.0/changesets.zip':
    path.resolve(__dirname, './v1.1.0/changesets.zip'),
  'https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/releases/download/v1.2.0/changesets.zip':
    path.resolve(__dirname, './v1.2.0/changesets.zip'),
  'https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/releases/download/v1.1.0/examples.zip':
    path.resolve(__dirname, './v1.1.0/examples.zip'),
  'https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/releases/download/v1.2.0/examples.zip':
    path.resolve(__dirname, './v1.2.0/examples.zip'),
  'https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/releases/download/v1.1.0/fingerprint-server-api.yaml':
    path.resolve(__dirname, './v1.1.0/schema.yaml'),
  'https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/releases/download/v1.2.0/fingerprint-server-api.yaml':
    path.resolve(__dirname, './v1.2.0/schema.yaml'),
  'https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/releases/download/v1.1.0/scopes': path.resolve(
    __dirname,
    './v1.1.0/scopes.yaml'
  ),
  'https://github.com/fingerprintjs/fingerprint-pro-server-api-openapi/releases/download/v1.2.0/scopes': path.resolve(
    __dirname,
    './v1.2.0/scopes.yaml'
  ),
}

export function maybeMockAsset(url: string) {
  const assetPath = (assetsMap as Record<string, string | undefined>)[url]
  if (assetPath) {
    const contents = fs.readFileSync(assetPath)
    return new Response(contents)
  }

  return false
}

import { updateSchema } from './update-schema'
import * as v110 from './__test__/v1.1.0/release.json'
import * as v120 from './__test__/v1.2.0/release.json'
import { maybeMockAsset } from './__test__/assets'
import { createTestPkg } from '../../../__tests__/test-utils/testPkgExec'
import * as fs from 'fs'
import * as path from 'path'

jest.mock('@actions/core')

const listReleases = jest.fn()
const getReleaseByTag = jest.fn()

jest.mock('@actions/github', () => {
  return {
    getOctokit: () => ({
      rest: {
        repos: {
          listReleases,
          getReleaseByTag,
        },
      },
    }),
  }
})

const orgFetch = globalThis.fetch

describe('Update schema', () => {
  let pkg: ReturnType<typeof createTestPkg>

  beforeEach(() => {
    jest.clearAllMocks()

    pkg = createTestPkg()
    fs.mkdirSync(path.join(pkg.path, '.changeset'))
    fs.mkdirSync(path.join(pkg.path, 'res'))
    fs.mkdirSync(path.join(pkg.path, 'examples'))

    fs.copyFileSync(
      path.join(__dirname, '__test__/initial-schema.yaml'),
      path.join(pkg.path, 'res/fingerprint-server-api.yaml')
    )

    Object.assign(global, {
      fetch: jest.fn().mockImplementation(async (url, opts) => {
        const response = maybeMockAsset(url)
        if (response) {
          return response
        }

        return orgFetch(url, opts)
      }),
    })
  })

  afterEach(() => {
    fs.rmSync(pkg.path, { recursive: true, force: true })
  })

  it('first schema sync with two releases', async () => {
    listReleases.mockResolvedValue({
      data: [v120, v110],
    })

    getReleaseByTag.mockImplementation(({ tag }) => {
      switch (tag) {
        case 'v1.1.0':
          return { data: v110 }

        case 'v1.2.0':
          return { data: v120 }

        default:
          throw new Error(`Unexpected tag: ${tag}`)
      }
    })

    await updateSchema({
      tag: 'v1.2.0',
      cwd: pkg.path,
      config: {
        owner: 'test-owner',
        repo: 'test-repo',
        scopesOwner: 'fingerprintjs',
        scopesRepo: 'fingerprint-pro-server-api-openapi',
        scopesConfigPath: 'config/scopes.yaml',
        scopesRef: 'main',
        schemaSource: 'fingerprint-server-api-schema-for-sdks.yaml',
        allowedScopes: ['events', 'visitors', 'webhook'],
        githubToken: '',
        examplesPath: 'examples',
        generateCommand: 'touch ./.generated',
        preRelease: false,
        schemaPath: 'res/fingerprint-server-api.yaml',
        force: false,
      },
      packageName: 'test-package',
    })

    expect(pkg.fileExists('.generated')).toBeTruthy()
    expect(pkg.readFile('.schema-version').toString()).toEqual('v1.2.0')
    expect(pkg.readFile('res/fingerprint-server-api.yaml')).toMatchSnapshot('schema')
  })

  it('first schema sync with two releases where GH API returns releases in ascending order', async () => {
    listReleases.mockResolvedValue({
      data: [v110, v120],
    })

    getReleaseByTag.mockImplementation(({ tag }) => {
      switch (tag) {
        case 'v1.1.0':
          return { data: v110 }

        case 'v1.2.0':
          return { data: v120 }

        default:
          throw new Error(`Unexpected tag: ${tag}`)
      }
    })

    await updateSchema({
      tag: 'v1.2.0',
      cwd: pkg.path,
      config: {
        owner: 'test-owner',
        repo: 'test-repo',
        scopesOwner: 'fingerprintjs',
        scopesRepo: 'fingerprint-pro-server-api-openapi',
        scopesConfigPath: 'config/scopes.yaml',
        scopesRef: 'main',
        allowedScopes: ['events', 'visitors', 'webhook'],
        githubToken: '',
        schemaSource: 'fingerprint-server-api-schema-for-sdks.yaml',
        examplesPath: 'examples',
        generateCommand: 'touch ./.generated',
        preRelease: false,
        schemaPath: 'res/fingerprint-server-api.yaml',
        force: false,
      },
      packageName: 'test-package',
    })

    expect(pkg.fileExists('.generated')).toBeTruthy()
    expect(pkg.readFile('.schema-version').toString()).toEqual('v1.2.0')
    expect(pkg.readFile('res/fingerprint-server-api.yaml')).toMatchSnapshot('schema')
  })

  it('fails fast when canonical scopes.yaml is not reachable', async () => {
    listReleases.mockResolvedValue({
      data: [v120, v110],
    })

    getReleaseByTag.mockImplementation(({ tag }) => {
      switch (tag) {
        case 'v1.1.0':
          return { data: v110 }

        case 'v1.2.0':
          return { data: v120 }

        default:
          throw new Error(`Unexpected tag: ${tag}`)
      }
    })

    Object.assign(global, {
      fetch: jest.fn().mockImplementation(async (url, opts) => {
        if (url.startsWith('https://raw.githubusercontent.com/')) {
          return new Response('Not Found', { status: 404, statusText: 'Not Found' })
        }
        const response = maybeMockAsset(url)
        if (response) {
          return response
        }

        return orgFetch(url, opts)
      }),
    })

    await expect(
      updateSchema({
        tag: 'v1.2.0',
        cwd: pkg.path,
        config: {
          owner: 'test-owner',
          repo: 'test-repo',
          scopesOwner: 'fingerprintjs',
          scopesRepo: 'fingerprint-pro-server-api-openapi',
          scopesConfigPath: 'config/does-not-exist.yaml',
          scopesRef: 'main',
          allowedScopes: ['events', 'visitors', 'webhook'],
          githubToken: '',
          schemaSource: 'fingerprint-server-api-schema-for-sdks.yaml',
          examplesPath: 'examples',
          generateCommand: 'touch ./.generated',
          preRelease: false,
          schemaPath: 'res/fingerprint-server-api.yaml',
          force: false,
        },
        packageName: 'test-package',
      })
    ).rejects.toThrow(/404|circuit breaker/)

    expect(pkg.fileExists('.generated')).toBeFalsy()
  }, 30000)
})

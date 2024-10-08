import { updateSchema } from './update-schema'
import * as v110 from './__test__/v1.1.0/release.json'
import * as v120 from './__test__/v1.2.0/release.json'
import { maybeMockAsset } from './__test__/assets'
import {
  readTestPackageFile,
  TEST_PACKAGE_PATH,
  testPackageFileExists,
} from '../../../__tests__/test-utils/testPkgExec'
import * as fs from 'fs'
import * as path from 'path'

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
  beforeEach(() => {
    jest.clearAllMocks()

    if (fs.existsSync(TEST_PACKAGE_PATH)) {
      fs.rmSync(TEST_PACKAGE_PATH, { recursive: true })
    }

    fs.mkdirSync(TEST_PACKAGE_PATH)
    fs.mkdirSync(path.join(TEST_PACKAGE_PATH, '.changeset'))
    fs.mkdirSync(path.join(TEST_PACKAGE_PATH, 'res'))
    fs.mkdirSync(path.join(TEST_PACKAGE_PATH, 'examples'))

    fs.copyFileSync(
      path.join(__dirname, '__test__/initial-schema.yaml'),
      path.join(TEST_PACKAGE_PATH, 'res/fingerprint-server-api.yaml')
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
    fs.rmSync(TEST_PACKAGE_PATH, { recursive: true })
  })

  it('first schema sync with two releases', async () => {
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
      cwd: TEST_PACKAGE_PATH,
      config: {
        owner: 'test-owner',
        repo: 'test-repo',
        allowedScopes: ['events', 'visitors', 'webhook'],
        githubToken: '',
        examplesPath: 'examples',
        generateCommand: 'touch ./.generated',
        preRelease: false,
        schemaPath: 'res/fingerprint-server-api.yaml',
      },
      packageName: 'test-package',
    })

    expect(testPackageFileExists('.generated')).toBeTruthy()
    expect(readTestPackageFile('.schema-version').toString()).toEqual('v1.2.0')
    expect(readTestPackageFile('res/fingerprint-server-api.yaml')).toMatchSnapshot()
  })
})

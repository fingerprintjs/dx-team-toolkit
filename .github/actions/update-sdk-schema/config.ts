import * as core from '@actions/core'

export interface Config {
  schemaPath: string
  examplesPath: string
  generateCommand: string
  githubToken: string
  preRelease: boolean
  owner: string
  repo: string
  ignoredScopes: string[]
}

export function getConfig(): Config {
  const [owner, repo] = core.getInput('openApiRepository').split('/')

  return {
    schemaPath: core.getInput('schemaPath'),
    examplesPath: core.getInput('examplesPath'),
    generateCommand: core.getInput('generateCommand'),
    githubToken: core.getInput('githubToken'),
    preRelease: core.getInput('preRelease') === 'true',
    owner,
    repo,
    ignoredScopes: core.getInput('ignoredScopes').split(',').filter(Boolean),
  }
}

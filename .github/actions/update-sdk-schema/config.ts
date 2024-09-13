import * as core from '@actions/core'

export interface Config {
  schemaPath: string
  examplesPath: string
  generateCommand: string
  githubToken: string
  preRelease: boolean
  owner: string
  repo: string
  allowedScopes: string[]
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
    allowedScopes: core.getInput('allowedScopes').split(',').filter(Boolean),
  }
}

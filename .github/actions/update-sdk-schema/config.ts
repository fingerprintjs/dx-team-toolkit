import * as core from '@actions/core'

export interface Config {
  schemaSource: string
  schemaPath: string
  examplesPath: string
  generateCommand: string
  githubToken: string
  preRelease: boolean
  owner: string
  repo: string
  scopesOwner: string
  scopesRepo: string
  scopesConfigPath: string
  scopesRef: string
  allowedScopes: string[]
  force: boolean
}

export function getConfig(): Config {
  const [owner, repo] = core.getInput('openApiRepository').split('/')
  const scopesRepositoryInput = core.getInput('scopesRepository').trim()
  const [scopesOwner, scopesRepo] = (scopesRepositoryInput || `${owner}/${repo}`).split('/')

  return {
    schemaSource: core.getInput('schemaSource'),
    schemaPath: core.getInput('schemaPath'),
    examplesPath: core.getInput('examplesPath'),
    generateCommand: core.getInput('generateCommand'),
    githubToken: core.getInput('githubToken'),
    preRelease: core.getInput('preRelease') === 'true',
    force: core.getInput('force') === 'true',
    owner,
    repo,
    scopesOwner,
    scopesRepo,
    scopesConfigPath: core.getInput('scopesConfigPath') || 'config/scopes.yaml',
    scopesRef: core.getInput('scopesRef') || 'main',
    allowedScopes: core
      .getInput('allowedScopes')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean),
  }
}

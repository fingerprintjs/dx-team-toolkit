import * as yaml from 'js-yaml'

interface Scope {
  path: string
  methods: string[]
}

export type ScopesMap = Record<string, Scope>

export function loadScopes(scopesYaml: string): ScopesMap {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return yaml.load(scopesYaml) as ScopesMap
}

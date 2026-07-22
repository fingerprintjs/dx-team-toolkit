import * as yaml from 'js-yaml'
import { ScopesMap } from './scopes.ts'

export function filterSchema(schemaYaml: string, scopes: ScopesMap, allowedScopes: string[]): string {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
  const schema = yaml.load(schemaYaml) as Record<string, any>
  const allowedMethods = new Map<string, Set<string>>()
  for (const scope of allowedScopes) {
    if (!Object.hasOwn(scopes, scope)) {
      console.error(`Scope ${scope} did not found in the configuration`)
      continue
    }
    const { path, methods } = scopes[scope]
    allowedMethods.set(path, new Set(methods))
  }

  for (const path in schema.paths) {
    if (!allowedMethods.has(path)) {
      console.info(`Removing path ${path}`)
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete schema.paths[path]
    } else {
      const allowedMethodsForPath = allowedMethods.get(path)
      if (allowedMethodsForPath !== undefined) {
        for (const method in schema.paths[path]) {
          if (!allowedMethodsForPath.has(method)) {
            console.info(`Removing method ${method} from ${path}`)
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete schema.paths[path][method]
          }
        }
      }
    }
  }

  let removedCounter = 1
  while (removedCounter > 0) {
    removedCounter = removeUnusedSchemas(schema)
  }

  return yaml.dump(schema)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeUnusedSchemas(schema: Record<string, any>) {
  const usageRegistry = new Set<string>()
  let removedCounter = 0
  walkJson(schema, '$ref', (usage) => {
    const componentName = usage['$ref']
    usageRegistry.add(componentName)
  })

  const components = schema.components?.schemas || {}
  for (const componentName of Object.keys(components)) {
    if (!usageRegistry.has(`#/components/schemas/${componentName}`)) {
      console.info(`Removing component ${componentName}`)
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete components[componentName]
      removedCounter++
    }
  }
  return removedCounter
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function walkJson(json: Record<string, any>, key: string, callback: (json: Record<string, any>) => void) {
  Object.keys(json).forEach((iteratorKey) => {
    if (iteratorKey === key) {
      callback(json)
    } else if (json[iteratorKey] && typeof json[iteratorKey] === 'object') {
      walkJson(json[iteratorKey], key, callback)
    }
  })
}

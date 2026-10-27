// A variable first argument can replace the base: an absolute URL, `//host`, or a backslash.
// https://url.spec.whatwg.org/#url-parsing
const GLOBAL_OBJECTS = new Set(['globalThis', 'window', 'self', 'global'])

const URL_MODULES = new Set(['url', 'node:url', 'whatwg-url'])

function isUrlModuleImport(def) {
  return (
    def.type === 'ImportBinding' &&
    def.node.type === 'ImportSpecifier' &&
    def.node.imported.name === 'URL' &&
    URL_MODULES.has(def.parent.source.value)
  )
}

// True when `name` resolves to the global, not a local class, function, variable, or parameter.
// `URL` imported from `url`, `node:url`, or `whatwg-url` is the same WHATWG URL, so it counts as the global.
function isGlobal(scope, name) {
  for (let current = scope; current; current = current.upper) {
    const variable = current.set.get(name)
    // typescript-eslint adds type-only names like `interface URL {}` to the scope. They don't shadow the value.
    if (variable && variable.isValueVariable !== false) {
      return variable.defs.every((def) => name === 'URL' && isUrlModuleImport(def))
    }
  }
  return true
}

function isUrlConstructor(node, scope) {
  if (node.type === 'Identifier') {
    return node.name === 'URL' && isGlobal(scope, 'URL')
  }
  return (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.object.type === 'Identifier' &&
    GLOBAL_OBJECTS.has(node.object.name) &&
    node.property.name === 'URL' &&
    isGlobal(scope, node.object.name)
  )
}

function isFixedString(node) {
  return (
    (node.type === 'Literal' && typeof node.value === 'string') ||
    (node.type === 'TemplateLiteral' && node.expressions.length === 0)
  )
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow new URL(path, base) and URL.parse(path, base) when path is not a fixed string',
      url: 'https://github.com/fingerprintjs/dx-team-toolkit/tree/main/packages/eslint-config-dx-team#dx-teamno-url-variable-path',
    },
    schema: [],
    messages: {
      variablePath:
        '{{call}} ignores base when path is absolute or starts with // or a backslash. Build from a fixed origin and assign pathname and search, or append the path without parsing it. If resolving against base is intended, disable this rule on the line with a reason.',
    },
  },
  create(context) {
    function check(node, call) {
      const [first] = node.arguments
      // A spread first argument can supply both path and base, so it can't be checked.
      const mayHaveBase = node.arguments.length >= 2 || first?.type === 'SpreadElement'
      if (first && mayHaveBase && !isFixedString(first)) {
        context.report({ node, messageId: 'variablePath', data: { call } })
      }
    }

    return {
      NewExpression(node) {
        if (isUrlConstructor(node.callee, context.sourceCode.getScope(node))) {
          check(node, 'new URL(path, base)')
        }
      },
      CallExpression(node) {
        const { callee } = node
        if (
          callee.type === 'MemberExpression' &&
          !callee.computed &&
          callee.property.name === 'parse' &&
          isUrlConstructor(callee.object, context.sourceCode.getScope(node))
        ) {
          check(node, 'URL.parse(path, base)')
        }
      },
    }
  },
}

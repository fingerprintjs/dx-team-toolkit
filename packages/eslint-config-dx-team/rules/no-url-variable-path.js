// A variable first argument can replace the base: an absolute URL, `//host`, or a backslash.
// https://url.spec.whatwg.org/#url-parsing
const GLOBAL_OBJECTS = new Set(['globalThis', 'window', 'self', 'global'])

function isUrlConstructor(node) {
  if (node.type === 'Identifier') {
    return node.name === 'URL'
  }
  return (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.object.type === 'Identifier' &&
    GLOBAL_OBJECTS.has(node.object.name) &&
    node.property.name === 'URL'
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
    },
    schema: [],
    messages: {
      variablePath:
        '{{call}} ignores base when path is absolute or starts with // or a backslash. Build from a fixed origin and assign pathname and search, or append the path without parsing it. If resolving against base is intended, disable this rule on the line with a reason.',
    },
  },
  create(context) {
    function check(node, call) {
      if (node.arguments.length >= 2 && !isFixedString(node.arguments[0])) {
        context.report({ node, messageId: 'variablePath', data: { call } })
      }
    }

    return {
      NewExpression(node) {
        if (isUrlConstructor(node.callee)) {
          check(node, 'new URL(path, base)')
        }
      },
      CallExpression(node) {
        const { callee } = node
        if (
          callee.type === 'MemberExpression' &&
          !callee.computed &&
          callee.property.name === 'parse' &&
          isUrlConstructor(callee.object)
        ) {
          check(node, 'URL.parse(path, base)')
        }
      },
    }
  },
}

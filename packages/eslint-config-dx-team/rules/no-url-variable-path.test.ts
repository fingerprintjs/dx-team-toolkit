import { RuleTester } from 'eslint'
import tseslint from 'typescript-eslint'
import * as rule from './no-url-variable-path'

const ruleTester = new RuleTester({ languageOptions: { parser: tseslint.parser } })

ruleTester.run('no-url-variable-path', rule, {
  valid: [
    "new URL('/path', base)",
    'new URL(`/path`, base)',
    'new URL(href)',
    "URL.parse('/path', base)",
    "new URL('/path', ...rest)",
    'URL.parse(href)',
    'new Other(path, base)',
    'URL.canParse(path, base)',
    'class URL { constructor(a: string, b: string) {} }\nnew URL(path, base)',
    'function f(URL: any) { return new URL(path, base) }',
    'const URL = { parse: (a: string, b: string) => a + b }\nURL.parse(path, base)',
    'const window = { URL: Other }\nnew window.URL(path, base)',
    "import { URL } from './routes'\nnew URL(path, base)",
  ],
  invalid: [
    { code: 'new URL(path, base)', errors: [{ messageId: 'variablePath' }] },
    // eslint-disable-next-line no-template-curly-in-string -- test input is source code with a template literal
    { code: 'new URL(`/${path}`, base)', errors: [{ messageId: 'variablePath' }] },
    { code: "new URL(request.nextUrl.pathname, 'https://example.com')", errors: [{ messageId: 'variablePath' }] },
    { code: 'new URL(path as string, base)', errors: [{ messageId: 'variablePath' }] },
    { code: 'new globalThis.URL(path, base)', errors: [{ messageId: 'variablePath' }] },
    { code: 'URL.parse(path, base)', errors: [{ messageId: 'variablePath' }] },
    { code: 'window.URL.parse(path, base)', errors: [{ messageId: 'variablePath' }] },
    { code: 'new URL(...[path, base])', errors: [{ messageId: 'variablePath' }] },
    { code: 'URL.parse(...args)', errors: [{ messageId: 'variablePath' }] },
    { code: "import { URL } from 'node:url'\nnew URL(path, base)", errors: [{ messageId: 'variablePath' }] },
    { code: "import { URL } from 'url'\nURL.parse(path, base)", errors: [{ messageId: 'variablePath' }] },
    { code: "import { URL } from 'whatwg-url'\nnew URL(path, base)", errors: [{ messageId: 'variablePath' }] },
    { code: 'interface URL { extra: string }\nnew URL(path, base)', errors: [{ messageId: 'variablePath' }] },
    { code: 'function f() { return new URL(path, base) }', errors: [{ messageId: 'variablePath' }] },
  ],
})

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
  ],
})

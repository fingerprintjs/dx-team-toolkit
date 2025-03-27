import { getChangesetScope, replacePackageName } from './changesets'

describe('replacePackageName', () => {
  it('replaces package name with single quote', () => {
    const changeset = `---
'fingerprint-pro-server-api-openapi': patch
---

**events**: Test patch change`

    const result = replacePackageName(changeset, 'test-package')

    expect(result).toMatchInlineSnapshot(`
      "---
      'test-package': patch
      ---

      **events**: Test patch change"
    `)
  })

  it('replaces package name with double quotes', () => {
    const changeset = `---
"fingerprint-pro-server-api-openapi": minor
---

Add \`mitmAttack\` (man-in-the-middle attack) Smart Signal.`

    const result = replacePackageName(changeset, 'test-package')

    expect(result).toMatchInlineSnapshot(`
      "---
      "test-package": minor
      ---

      Add \`mitmAttack\` (man-in-the-middle attack) Smart Signal."
    `)
  })
})

describe('getChangesetScope', () => {
  it('returns correct scope', () => {
    const changeset = `---
'fingerprint-pro-server-api-openapi': patch
---

**events**: Test patch change`

    const scope = getChangesetScope(changeset)

    expect(scope).toBe('events')
  })

  it('returns null if no scope is found', () => {
    const changeset = `---
'fingerprint-pro-server-api-openapi': patch
---

Test patch change`

    const scope = getChangesetScope(changeset)

    expect(scope).toBeNull()
  })
})

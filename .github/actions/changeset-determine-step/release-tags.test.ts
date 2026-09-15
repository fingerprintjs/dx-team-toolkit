import { releaseTagCandidates } from './release-tags.ts'

describe('releaseTagCandidates', () => {
  it('checks the workspace tag before the single-package tag', () => {
    expect(releaseTagCandidates('@fingerprint/node-sdk', '7.7.1')).toEqual(['@fingerprint/node-sdk@7.7.1', 'v7.7.1'])
  })

  it('falls back to the single-package tag for an unnamed package', () => {
    expect(releaseTagCandidates(undefined, '7.7.1')).toEqual(['v7.7.1'])
  })
})

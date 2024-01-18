// Default values you can find in https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js
const releaseRules = [
  { breaking: true, release: 'major' },
  { revert: true, release: 'patch' },

  { type: 'feat', release: 'minor' },
  { type: 'fix', release: 'patch' },
  { type: 'perf', release: 'patch' },

  { type: 'build', scope: 'deps', release: 'patch' }, // dependabot
  { type: 'docs', scope: 'README', release: 'patch' },
]

module.exports = releaseRules

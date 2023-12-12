module.exports = {
  "dryRun": true,
  "branches": [
    "main",
    {
      "name": "release-*",
      "prerelease": true,
    },
  ],
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "config": "@fingerprintjs/conventional-changelog-dx-team",
        "releaseRules": "@fingerprintjs/conventional-changelog-dx-team/release-rules"
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "config": "@fingerprintjs/conventional-changelog-dx-team",
      }
    ],
    [
      "@semantic-release/exec",
      {
        "prepareCmd": "echo \"Prepare to release ${nextRelease.version}\""
      }
    ],
  ]
}

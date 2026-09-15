import { execSync } from 'child_process'

import fs from 'fs'

import * as core from '@actions/core'

import { releaseTagCandidates } from './release-tags.ts'

try {
  // Collect changesets stats
  const random = Math.random().toString(36).slice(2, 10)
  const statusPath = `changeset-status-${random}.json`
  execSync(`npx changeset status --output "${statusPath}"`, { stdio: 'inherit' })

  // Read status
  const status = JSON.parse(fs.readFileSync(statusPath, 'utf-8'))
  console.log(`[determine-changeset-status] status=${JSON.stringify(status, null, 2)}`)
  fs.unlinkSync(statusPath)

  let action = 'none'
  if (status.changesets && status.changesets.length > 0) {
    action = 'pr' // PR will be created
  } else {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    const currentVersion = pkg.version
    const tags = releaseTagCandidates(pkg.name, currentVersion)
    console.log(`[determine-changeset-action] currentVersion=${currentVersion} candidateTags=${tags.join(', ')}`)

    execSync(`git fetch --tags`) // fetch tags
    const released = tags.some((tag) => {
      try {
        // The full ref path and the `--` keep a tag name such as
        // `@scope/pkg@1.2.3` from being read as an option.
        execSync(`git rev-parse --verify --quiet "refs/tags/${tag}" --`, { stdio: 'ignore' })
        return true
      } catch {
        return false
      }
    })

    if (!released) {
      // no tag was found, we can publish
      action = 'publish'
    }
  }

  core.setOutput('action', action) // action = 'pr' | 'publish' | 'none'
  console.log(`[determine-changeset-action] action=${action}`)
} catch (err) {
  if (err instanceof Error) {
    core.setFailed(err.message)
  } else {
    core.setFailed(String(err))
  }
}

import * as core from '@actions/core'
import { changesetReleaseNotes } from './changeset-release-notes'

export async function main() {
  const notes = await changesetReleaseNotes()

  if (notes) {
    core.setOutput('release-notes', notes)
  }
}

main().catch((err) => {
  core.setFailed(err)
})

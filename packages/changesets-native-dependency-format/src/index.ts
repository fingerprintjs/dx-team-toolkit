import type { ChangelogFunctions, GetDependencyReleaseLine, GetReleaseLine } from '@changesets/types'
import fpFormat from '@fingerprintjs/changesets-changelog-format'
import { generateNativeDepsNote } from './native-dependency/note'
import { getLastChangeset } from './native-dependency/changeset'

const options = {
  repo: 'fingerprintjs/fingerprintjs-pro-react-native',
}

export type Options = {
  packageName?: string
}

const getReleaseLine: GetReleaseLine = async (changeset, type, opts: Options | null) => {
  if (!opts?.packageName) {
    throw new Error('Missing `opts.packageName`')
  }

  const lastChangeset = await getLastChangeset(opts?.packageName)
  const isLastChangeset = lastChangeset === changeset.id

  let line = await fpFormat.getReleaseLine(changeset, type, options)

  if (isLastChangeset) {
    try {
      const nativeDepsNote = await generateNativeDepsNote()
      line += `\n\n ${nativeDepsNote}`
    } catch (e) {
      console.error('Failed to generate native dependencies note', e)
    }
  }

  return line
}

const getDependencyReleaseLine: GetDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
  return fpFormat.getDependencyReleaseLine(changesets, dependenciesUpdated, options)
}

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
}

export default defaultChangelogFunctions

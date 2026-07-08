import type { ChangelogFunctions, GetDependencyReleaseLine, GetReleaseLine } from '@changesets/types'
import fpFormat from '@fingerprintjs/changesets-changelog-format'
import { generateNativeDepsNote } from './native-dependency/note'
import { getLastChangeset } from './native-dependency/changeset'

export type Options = {
  packageName?: string
  androidPath?: string
  iosPodspecPath?: string
  repo?: string
}

const getReleaseLine: GetReleaseLine = async (changeset, type, opts: Options | null) => {
  if (!opts?.packageName) {
    throw new Error('Missing `opts.packageName`')
  }

  if (!opts?.androidPath) {
    throw new Error('Missing `opts.androidPath`')
  }

  if (!opts?.iosPodspecPath) {
    throw new Error('Missing `opts.iosPodspecPath`')
  }

  if (!opts?.repo) {
    throw new Error('Missing `opts.repo`')
  }

  const lastChangeset = await getLastChangeset(opts?.packageName)
  const isLastChangeset = lastChangeset === changeset.id

  let line = await fpFormat.getReleaseLine(changeset, type, { repo: opts.repo })

  if (isLastChangeset) {
    try {
      const nativeDepsNote = await generateNativeDepsNote(opts.androidPath, opts.iosPodspecPath)
      line += `\n\n ${nativeDepsNote}`
    } catch (e) {
      console.error('Failed to generate native dependencies note', e)
    }
  }

  return line
}

const getDependencyReleaseLine: GetDependencyReleaseLine = async (changesets, dependenciesUpdated, opts: Options) => {
  if (!opts?.repo) {
    throw new Error('Missing `opts.repo`')
  }

  return fpFormat.getDependencyReleaseLine(changesets, dependenciesUpdated, { repo: opts.repo })
}

const defaultChangelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
}

export default defaultChangelogFunctions

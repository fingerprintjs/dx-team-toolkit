import type { ChangelogFunctions, GetDependencyReleaseLine, GetReleaseLine } from '@changesets/types'
import fpFormat from '@fingerprintjs/changesets-changelog-format'
import { type AndroidNoteOptions, generateNativeDepsNote, type IOSNoteOptions } from './native-dependency/note'
import { getLastChangeset } from './native-dependency/changeset'

export type Options = {
  packageName?: string
  android?: AndroidNoteOptions
  ios?: IOSNoteOptions
  repo?: string
}

const getReleaseLine: GetReleaseLine = async (changeset, type, opts: Options | null) => {
  if (!opts?.packageName) {
    throw new Error('Missing `opts.packageName`')
  }

  if (!opts?.android?.path) {
    throw new Error('Missing `opts.android.path`')
  }

  if (!opts?.android?.gradleTaskName) {
    throw new Error('Missing `opts.android.gradleTaskName`')
  }

  if (!opts?.ios?.podspecPath) {
    throw new Error('Missing `opts.ios.podspecPath`')
  }

  if (!opts?.ios?.dependencyName) {
    throw new Error('Missing `opts.ios.dependencyName`')
  }

  if (!opts?.repo) {
    throw new Error('Missing `opts.repo`')
  }

  const lastChangeset = await getLastChangeset(opts?.packageName)
  const isLastChangeset = lastChangeset === changeset.id

  let line = await fpFormat.getReleaseLine(changeset, type, { repo: opts.repo })

  if (isLastChangeset) {
    try {
      const nativeDepsNote = await generateNativeDepsNote(opts.android, opts.ios)
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

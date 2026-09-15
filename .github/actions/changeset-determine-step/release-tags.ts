/**
 * Tag names under which changesets may already have released `version`.
 *
 * `changeset tag` names tags `<package>@<version>` in a workspace and `v<version>`
 * in a single-package repository, so both have to be checked. Looking for only one
 * shape reads an already-released version as unpublished.
 */
export function releaseTagCandidates(name: string | undefined, version: string): string[] {
  return name ? [`${name}@${version}`, `v${version}`] : [`v${version}`]
}

export function createChangeset(project, version, description) {
  return `
---
'${project}': ${version}
---

${description}

  `.trim()
}

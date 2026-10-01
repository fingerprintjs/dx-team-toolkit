---
'@fingerprintjs/changesets-native-dependency-format': patch
---

Append the native SDK version note to the last changeset of the lowest change type, not the first. Before, with two or more changesets of that type, the note appeared between them.

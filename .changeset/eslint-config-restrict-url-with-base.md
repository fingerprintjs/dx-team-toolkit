---
'@fingerprintjs/eslint-config-dx-team': minor
---

Flag `new URL(path, base)` and `URL.parse(path, base)` when `path` is not a string literal. If `path` is an absolute URL or starts with `//` or a backslash, the URL parser drops `base`, so a request path can send a redirect or upstream request to another host. Build from a fixed origin and assign `pathname`, or disable the rule on that line with a reason where resolving against the base is intended. The rule uses `no-restricted-syntax`, so a consuming config that sets its own `no-restricted-syntax` replaces it.

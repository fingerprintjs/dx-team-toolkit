---
'@fingerprintjs/eslint-config-dx-team': minor
---

Add the `dx-team/no-url-variable-path` rule, on by default. It flags `new URL(path, base)` and `URL.parse(path, base)` when `path` is not a fixed string. If `path` is an absolute URL or starts with `//` or a backslash, the URL parser drops `base`, so a request path can send a redirect or upstream request to another host. Build from a fixed origin and assign `pathname`, or disable the rule on that line with a reason where resolving against the base is intended.

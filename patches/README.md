# eslint-plugin-import 2.32.0 on ESLint 10.14.0

The published plugin still excludes ESLint 10 and crashes when `import/order`
tries to report/fix ordinary ordering or group-spacing violations. Keep the
existing rules and their options; backport the two token API substitutions.

Primary sources checked 2026-10-31 UTC:

- [Published package](https://registry.npmjs.org/eslint-plugin-import/2.32.0):
  latest remains 2.32.0; its ESLint peer range ends at 9.
- [ESLint 10 migration](https://eslint.org/docs/latest/use/migrate-to-10.0.0#removal-of-deprecated-sourcecode-methods):
  replace `getTokenOrCommentBefore/After(node)` with
  `getTokenBefore/After(node, { includeComments: true })`.
- [Upstream order rule](https://github.com/import-js/eslint-plugin-import/blob/main/src/rules/order.js)
  and [token helper](https://github.com/import-js/eslint-plugin-import/blob/main/src/core/getTokenOrComment.js)
  already implement this replacement on unreleased main. No unreleased package
  or alternate plugin is introduced.

The ESLint 9 implementations of the removed methods delegate directly to those
same supported calls. `includeComments: true` is essential: omitting it changes
which comments move with an import. Preserve the original iteration limits,
ordering decisions, report text, ranges, and fix construction.

The patch also declares **only 10.14.0** as an additional peer in the patched
manifest. The equally narrow `peerDependencyRules.allowedVersions` entry is
needed because pnpm resolves peers before applying package.json patches.
It applies only to `eslint-plugin-import@2.32.0 > eslint@10.14.0`; there is no
blanket peer exception. A package extension cannot replace the existing peer.

## API inventory and exercised scope

The only enabled plugin rules are `import/order` and `import/no-duplicates`.
An inventory of all published plugin JS files finds exactly two calls to the
four SourceCode methods removed by ESLint 10: `getTokenOrCommentAfter` and
`getTokenOrCommentBefore`, both in `lib/rules/order.js`. There are no calls to
`isSpaceBetweenTokens` or `getJSDocComment`. `no-duplicates` needs no code change.

Both active rules obtain SourceCode through `eslint-module-utils/contextCompat`;
that helper uses `context.sourceCode`, `context.filename` and
`sourceCode.getScope` on ESLint 10. Its removed-method fallbacks are guarded.
`getPhysicalFilename` falls back to the filename helper when the old method is
absent. The resolver's parser helpers prefer `languageOptions`; these two rules
classify/resolve import paths without parsing external modules. Supported token,
comment and text methods used by the active rules remain available. Other plugin
rules and non-default options are outside this application's enabled scope.

## Regression checks and removal

`pnpm test` runs 33 fixtures using the repository's exact import rule settings
and parser. Goldens were captured from unpatched 2.32.0 on ESLint **9.39.5**.
They assert diagnostic text/severity/locations/fix ranges, complete fixed output,
and an unchanged second fix pass. Only checkout-root paths in diagnostics are
normalized. Coverage includes group spacing, group and case-insensitive
alphabetical order, before/after/inline/multiline comments, CRLF/EOF, CommonJS,
TypeScript import-equals/type imports, duplicate merge variants and side-effect
barriers. A physical `.tsx` probe also exercises the full type-aware root config
through separate CLI runs, fixes the violations, and verifies clean re-lint.

Commented duplicates and conflicting defaults deliberately retain the original
non-fixable diagnostics. Namespace/type/query distinctions and unsafe movement
past a side-effect import retain their original behavior. The patch does not
invent a new fix or remove a diagnostic. The original ESLint 10 head fails 19 of
the 34 regression checks with the removed-API error; the patched head passes all
34. The existing five application tests also remain enabled.

When a supported upstream release is published, review its migration and replace
this patch, exact peer exception and patched lock entry together. Keep the
regression tests. Do not broaden the exception for a new ESLint version without
checking its contract and rerunning parity and project validation.

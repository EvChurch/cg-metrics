import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ESLint } from "eslint";
import importPlugin from "eslint-plugin-import";

const root = fileURLToPath(new URL("../", import.meta.url));
const config = await new ESLint({ cwd: root }).calculateConfigForFile(`${root}src/App.tsx`);
// Exercise exactly the enabled import rules/options, with the repository parser.
// Project-backed integration is also tested below; isolated fixtures can include
// deliberately unresolved modules and CommonJS/type-import syntax.
const options = {
  cwd: root,
  overrideConfigFile: true,
  overrideConfig: [{
    files: ["**/*.ts"],
    plugins: { import: importPlugin },
    rules: {
      "import/order": config.rules["import/order"],
      "import/no-duplicates": config.rules["import/no-duplicates"],
    },
    languageOptions: { parser: config.languageOptions.parser, ecmaVersion: 2020, sourceType: "module" },
  }],
};
const linter = new ESLint(options);
const fixer = new ESLint({ ...options, fix: true });
const fixtures = JSON.parse(await readFile(new URL("fixtures/import-lint.json", import.meta.url), "utf8"));
const messages = (result) => result.messages.map(({ ruleId, severity, message, line, column, endLine, endColumn, fix }) =>
  ({ ruleId, severity, message: message.replaceAll(root, "<repo>/"), line, column, endLine, endColumn, ...(fix ? { fix } : {}) }));

for (const fixture of fixtures) {
  test(`import rules preserve ESLint 9 diagnostics and fixes: ${fixture.name}`, async () => {
    const [before] = await linter.lintText(fixture.source, { filePath: "src/__import_lint_fixture.ts" });
    assert.equal(before.fatalErrorCount, 0);
    assert.deepEqual(messages(before), fixture.messages);
    const [fixed] = await fixer.lintText(fixture.source, { filePath: "src/__import_lint_fixture.ts" });
    const output = fixed.output ?? fixture.source;
    assert.equal(output, fixture.output);
    assert.deepEqual(messages(fixed), fixture.remaining);
    const [second] = await fixer.lintText(output, { filePath: "src/__import_lint_fixture.ts" });
    assert.equal(second.output, undefined, "second fix pass must make no further changes");
    assert.deepEqual(messages(second), fixture.remaining);
    if (fixture.remaining.length === 0) assert.equal(second.errorCount, 0);
    // Comments are intentionally not merged when the original rule refuses an
    // ambiguous duplicate fix. Preserve the diagnostics instead of losing them.
    for (const comment of fixture.source.match(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g) ?? []) {
      assert.ok(output.includes(comment), `comment was lost: ${comment}`);
    }
  });
}

test("configured type-aware lint reports and fixes the former crash path", async () => {
  const path = `${root}src/__import_lint_regression.tsx`;
  const source = 'import { useState } from "react";\nimport App from "./App";\nimport { useEffect } from "react";\nexport const Sample = () => { useEffect(() => { document.title = "test"; }, []); return useState(App); };\n';
  await writeFile(path, source, { flag: "wx" });
  try {
    // Separate CLI invocations mirror developer/CI runs and avoid stale parser
    // project caches when the physical file changes between fix passes.
    const lint = (...args) => {
      const result = spawnSync(process.execPath, ["node_modules/eslint/bin/eslint.js", path, "--format", "json", ...args], { cwd: root, encoding: "utf8" });
      assert.ok(result.status === 0 || result.status === 1, result.stderr);
      return JSON.parse(result.stdout)[0];
    };
    const before = lint();
    assert.equal(before.fatalErrorCount, 0);
    assert.ok(before.messages.some((m) => m.ruleId === "import/order"));
    assert.ok(before.messages.some((m) => m.ruleId === "import/no-duplicates"));
    const fixed = lint("--fix");
    assert.equal(fixed.errorCount, 0, JSON.stringify(fixed.messages));
    const output = await readFile(path, "utf8");
    assert.notEqual(output, source);
    const second = lint();
    assert.equal(second.errorCount, 0, JSON.stringify(second.messages));
    assert.ok(!second.messages.some((m) => m.ruleId?.startsWith("import/")));
  } finally {
    await unlink(path);
  }
});

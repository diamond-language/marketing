// Writes wasm/cuts.json: the sources of the cuts the homepage REPL can `require_cut`, keyed by
// the path the module looks for them at (/cuts/NAME/...). Tests and fixtures are left out.
// Rerun after a release with the d6 checkout's packages/:
//
//   node tools/bundle_cuts.mjs ../diamond/packages mjolnir arel
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const [packages, ...names] = process.argv.slice(2);
if (!packages || names.length === 0) {
  console.error('usage: node tools/bundle_cuts.mjs PACKAGES_DIR CUT...');
  process.exit(2);
}
const files = {};
for (const name of names) {
  const root = join(packages, name);
  for (const entry of await readdir(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.d6$|^Cutfile$/.test(entry.name)) continue;
    const path = relative(root, join(entry.parentPath, entry.name));
    if (/(^|\/)tests?(\/|_)|_test\.d6$/.test(path)) continue;
    files[`/cuts/${name}/${path}`] = await readFile(join(root, path), 'utf8');
  }
}
await writeFile(new URL('../wasm/cuts.json', import.meta.url), JSON.stringify(files) + '\n');
console.log(`${Object.keys(files).length} files from ${names.join(', ')}`);

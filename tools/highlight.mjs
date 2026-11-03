// Prints a d6 source file as HTML coloured by the language's own lexer -- the same
// js/diamond-wasm.js and wasm/diamond.wasm the homepage REPL uses -- for pasting into a
// <pre><code> block, so the page's examples colour exactly as the REPL does.
//
//   node tools/highlight.mjs FILE.d6
import { readFile } from 'node:fs/promises';
import { DiamondRepl } from '../js/diamond-wasm.js';

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const repl = await DiamondRepl.load(await readFile(new URL('../wasm/diamond.wasm', import.meta.url)));
const source = (await readFile(process.argv[2], 'utf8')).replace(/\n$/, '');
process.stdout.write(repl.highlight(source)
  .map(({ cls, text }) => (cls ? `<span class="${cls}">${escape(text)}</span>` : escape(text)))
  .join('') + '\n');

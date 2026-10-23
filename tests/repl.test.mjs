import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {before, beforeEach, test} from 'node:test';
import {DiamondRepl} from '../js/diamond-wasm.js';

// Exercise the actual homepage examples and shipped module, without a browser
// or external dependencies. Visual and keyboard browser checks remain manual.
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const entities = {amp: '&', quot: '"', apos: "'", lt: '<', gt: '>'};
function decode(value) {
  return value.replace(/&#(x[\da-f]+|\d+);|&(amp|quot|apos|lt|gt);/gi,
    (_, number, named) => number
      ? String.fromCodePoint(number[0].toLowerCase() === 'x'
        ? parseInt(number.slice(1), 16) : Number(number))
      : entities[named.toLowerCase()]);
}
const examples = [...html.matchAll(/data-repl-example="([^"]*)"/g)]
  .map((match) => decode(match[1]));
let repl;
before(async () => {
  repl = await DiamondRepl.load(await readFile(new URL('../wasm/diamond.wasm', import.meta.url)));
});
beforeEach(() => repl.reset());

test('all homepage chips have an expected outcome', () => assert.equal(examples.length, 6));
const outcomes = [
  ['Classes', 'Rex says woof'],
  ['Types', null],
  ['Blocks', '30'],
  ['Structs', 'Point(x: 1, y: 2)'],
  ['Database', '[{name: Grace, age: 45}, {name: Ada, age: 36}]'],
  ['Errors', 'rescued: negative'],
];
for (const [index, [name, expected]] of outcomes.entries()) {
  test(`homepage ${name} example`, () => {
    let result;
    for (const line of examples[index].split('\n')) result = repl.submit(line);
    if (name === 'Types') {
      assert.equal(result.kind, 'error');
      assert.match(result.text, /expected Int, got String/);
    } else {
      assert.deepEqual(result, {kind: 'ok', text: expected});
    }
  });
}
test('later submissions retain printed output without replaying old output', () => {
  for (const word of ['first', 'second', 'third']) {
    assert.deepEqual(repl.submit(`puts("${word}")`), {kind: 'ok', text: `${word}\nnil`});
  }
});
test('completion uses session receivers and leaves evaluation working', () => {
  repl.submit('words = ["a", "b"]');
  const result = repl.complete('words.ma');
  assert.equal(result.prefix, 'ma');
  assert(result.labels.includes('map'));
  assert(result.labels.every((label) => label.startsWith('ma')));
  assert.deepEqual(repl.submit('words.length()'), {kind: 'ok', text: '2'});
});

#!/usr/bin/env ts-node

import { assert } from '../lib/test.js'
import { itemValue, makeRucksack, run } from '../src/3.js';

const r1 = makeRucksack('vJrwpWtwJgWrhcsFMMfFFhFp');
assert(r1[0].join('') === 'vJrwpWtg');
assert(r1[1].join('') === 'hcsFMfp');

const r2 = makeRucksack('jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL');
assert(r2[0].join('') === 'DGHjLNqRz');
assert(r2[1].join('') === 'rsFMfZSL');

assert(itemValue('p') === 16);
assert(itemValue('L') === 38);
assert(itemValue('P') === 42);

run('input/3_test.txt', (result) => {
  assert(result[0] == 157);
  assert(result[1] == 70);
});

run('input/3.txt', (result) => {
  assert(result[0] == 8240);
  assert(result[1] == 2587);
});

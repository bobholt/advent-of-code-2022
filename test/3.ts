#!/usr/bin/env ts-node

import { assert } from '../lib/test.js';
import { ensure } from '../lib/util.js';
import { itemValue, makeRucksack, run } from '../src/3.js';
import { Set } from 'immutable';

const r1 = makeRucksack('vJrwpWtwJgWrhcsFMMfFFhFp');
assert(ensure(r1.get(0)).equals(Set('vJrwpWtwJgWr')));
assert(ensure(r1.get(1)).equals(Set('hcsFMMfFFhFp')));

const r2 = makeRucksack('jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL');
assert(ensure(r2.get(0)).equals(Set('jqHRNqRjqzjGDLGL')));
assert(ensure(r2.get(1)).equals(Set('rsFMfFZSrLrFZsSL')));

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

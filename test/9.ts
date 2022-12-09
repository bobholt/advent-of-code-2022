#!/usr/bin/env ts-node

import { assert } from '../lib/test.js';
import { isAdjacent, run } from '../src/9.js';

assert(isAdjacent([2,2], [3,3]));
assert(!isAdjacent([2,2], [2,4]));

run('input/9_test.txt', (result) => {
  assert(result[0] === 13);
  assert(result[1] === 1);
});

run('input/9_test2.txt', (result) => {
  assert(result[1] === 36);
});

run('input/9.txt', (result) => {
  assert(result[0] == 6522);
  assert(result[1] == 2717);
});

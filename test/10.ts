#!/usr/bin/env ts-node

import { assert } from '../lib/test.js';
import { run } from '../src/10.js';

run('input/10_test.txt', (result) => {
  console.log(result);
  assert(result[0] === 13140);
  // assert(result[1] === 1);
});

run('input/10.txt', (result) => {
  console.log(result);
  // assert(result[0] == 6522);
  // assert(result[1] == 2717);
});

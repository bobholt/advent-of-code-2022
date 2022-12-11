#!/usr/bin/env ts-node

import { assert } from '../lib/test.js';
import { run } from '../src/11.js';

run('input/11_test.txt', (result) => {
  console.log(result);
  assert(result[0] === 10605);
  // assert(result[1] === 1);
});

run('input/11.txt', (result) => {
  console.log(result);
  assert(result[0] == 110888);
  // assert(result[1] == 2717);
});

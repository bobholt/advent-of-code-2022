#!/usr/bin/env ts-node

import { assert } from '../lib/test.js';
import { run } from '../src/6.js';


run('input/6_test.txt', (result) => {
  assert(result[0] === 7);
  assert(result[1] == 19);
});

run('input/6.txt', (result) => {
  console.log(result[1]);
  assert(result[0] == 1566);
  assert(result[1] == 2265);
});

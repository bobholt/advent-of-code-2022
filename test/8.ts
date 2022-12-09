#!/usr/bin/env ts-node

import { assert } from '../lib/test.js';
import { run } from '../src/8.js';


run('input/8_test.txt', (result) => {
  assert(result[0] === 21);
  assert(result[1] == 8);
});

run('input/8.txt', (result) => {
  assert(result[0] == 1717);
  assert(result[1] == 321975);
});

#!/usr/bin/env ts-node

import { assert } from '../lib/test.js'
import { run } from '../src/1.js';

run('input/1_test.txt', (result) => {
  assert(result[0] == 24000);
  assert(result[1] == 45000);
});

run('input/1.txt', (result) => {
  assert(result[0] == 68292);
  assert(result[1] == 203203);
});

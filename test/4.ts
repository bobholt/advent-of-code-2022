#!/usr/bin/env ts-node

import { assert } from '../lib/test.js';
import { run } from '../src/4.js';

run('input/4_test.txt', (result) => {
  assert(result[0] == 2);
  assert(result[1] == 4);
});

run('input/4.txt', (result) => {
  assert(result[0] == 540);
  assert(result[1] == 872);
});

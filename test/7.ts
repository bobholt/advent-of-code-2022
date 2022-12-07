#!/usr/bin/env ts-node

import { assert } from '../lib/test.js';
import { run } from '../src/7.js';


run('input/7_test.txt', (result) => {
  assert(result[0] === 95437);
  assert(result[1] == 24933642);
});

run('input/7.txt', (result) => {
  assert(result[0] == 2031851);
  assert(result[1] == 2568781);
});

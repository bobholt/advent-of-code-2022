#!/usr/bin/env ts-node

import { assert } from '../lib/test.js'
import { run, scoreRound } from '../src/2.js';

assert(scoreRound('A Y', false)[1] == 8);
assert(scoreRound('B X', false)[1] == 1);
assert(scoreRound('C Z', false)[1] == 6);

assert(scoreRound('A Y', true)[1] == 4);
assert(scoreRound('B X', true)[1] == 1);
assert(scoreRound('C Z', true)[1] == 7);

run('input/2_test.txt', (result) => {
  assert(result.a == 15);
  assert(result.b == 12);
});

run('input/2.txt', (result) => {
  assert(result.a == 13268);
  assert(result.b == 15508);
});

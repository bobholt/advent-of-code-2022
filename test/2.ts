#!/usr/bin/env ts-node

import { assert } from '../lib/test.js'
import { rock, paper, scissors, run, scoreRound } from '../src/2.js';

assert(scoreRound([
  { play: rock, score: 0 },
  { play: paper, score: 0 }
])[1].score == 8);

assert(scoreRound([
  { play: paper, score: 0 },
  { play: rock, score: 0 }
])[1].score == 1);

assert(scoreRound([
  { play: scissors, score: 0 },
  { play: scissors, score: 0 }
])[1].score == 6);

assert(scoreRound([
  { play: rock, score: 0 },
  { play: rock, score: 0 }
])[1].score == 4);

assert(scoreRound([
  { play: paper, score: 0 },
  { play: rock, score: 0 }
])[1].score == 1);

assert(scoreRound([
  { play: scissors, score: 0 },
  { play: rock, score: 0 }
])[1].score == 7);

run('input/2_test.txt', (result) => {
  assert(result[0] == 15);
  assert(result[1] == 12);
});

run('input/2.txt', (result) => {
  assert(result[0] == 13268);
  assert(result[1] == 15508);
});

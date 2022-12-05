#!/usr/bin/env ts-node

import { List } from 'immutable';
import { assert } from '../lib/test.js';
import { parse, tierFromString, run } from '../src/5.js';
import type { DataStringArray } from '../lib/io.js';
import { ensure } from '../lib/util.js';


assert(tierFromString(
  '[T]             [P]     [J]        '
).join('') === 'T   P J  ');

const ship = parse(List([
  '[T]             [P]     [J]        '
]) as DataStringArray)[0];
assert(ship.size === 9);
assert(ensure(ship.get(0)).join('') === 'T');

const procedure = ensure(parse(List([
  'move 3 from 8 to 2'
]) as DataStringArray)[1].get(0));
assert(procedure.length === 6);
assert(ensure(procedure).join('') === 'move3from8to2');


run('input/5_test.txt', (result) => {
  assert(result[0] == 'CMZ');
  assert(result[1] == 'MCD');
});

run('input/5.txt', (result) => {
  assert(result[0] == 'BZLVHBWQF');
  assert(result[1] == 'TDGJQTZSL');
});

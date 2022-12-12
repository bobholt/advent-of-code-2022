/*
 * Advent of Code 2022 Day 11
 * Copyright (C) 2022 Robert B. Holt
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.  If not, see
 * <https://www.gnu.org/licenses/>.
*/

// https://adventofcode.com/2022/day/11

import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
import { ensure } from '../lib/util.js';

type Response = readonly [number, number];

type Monkey = {
  items: bigint[],
  itemsInspected: number,
  test: bigint,
  trueTarget: number,
  falseTarget: number,
  op: string,
  opVal: 'old' | bigint,
};
const baseMonkey: Monkey =
  { items: [] as bigint[], itemsInspected: 0, test: BigInt(0), trueTarget: 0, falseTarget: 0, op: '', opVal: 'old' };

const monkeyRegEx = /^Monkey (\d):{1}/;
const startingItemRegEx = /^\s{2}Starting items: (.*)/;
const operationRegEx = /^\s{2}Operation: new = old (\W{1}) (.*)/;
const testRegEx = /^\s{2}Test: divisible by (.*)/;
const trueRegEx = /^\s{4}If true: throw to monkey (\d*)/;
const falseRegEx = /^\s{4}If false: throw to monkey (\d*)/;

function parseMonkeys(data: DataStringArray): Monkey[] {
  let monkeys: Monkey[] = [];
  let currentMonkey: number = 0;

  data.forEach((line) => {
    if (monkeyRegEx.test(line)) {
      currentMonkey = Number(ensure(line.match(monkeyRegEx))[1]);
      monkeys.push(Object.assign({}, baseMonkey));
      return monkeys;
    }
    if (startingItemRegEx.test(line)) {
      ensure(monkeys[currentMonkey]).items = ensure(ensure(line.match(startingItemRegEx))[1]).split(', ').map((v) => BigInt(v))
      return monkeys;
    }
    if (operationRegEx.test(line)) {
      const [_, op, val] = ensure(line.match(operationRegEx));
      const opVal: bigint | 'old' = (val || 0) === 'old' ? 'old' : BigInt(val || 0);
      ensure(monkeys[currentMonkey]).op = ensure(op);
      ensure(monkeys[currentMonkey]).opVal = opVal;
      return monkeys;
    }
    if (testRegEx.test(line)) {
      ensure(monkeys[currentMonkey]).test = BigInt(ensure(line.match(testRegEx))[1] || 0);
      return monkeys;
    }
    if (trueRegEx.test(line)) {
      ensure(monkeys[currentMonkey]).trueTarget = Number(ensure(line.match(trueRegEx))[1]);
      return monkeys;
    }
    if (falseRegEx.test(line)) {
      ensure(monkeys[currentMonkey]).falseTarget = Number(ensure(line.match(falseRegEx))[1]);
      return monkeys;
    }
    if (line === '') return;
    throw new Error(`i don't know what to do with this: ${line}`);
  });
  return monkeys;
}

function round(monkeys: Monkey[], worryFactor: bigint | null): Monkey[] {
  monkeys.forEach((monkey) => {
    const {items, op, opVal, test, trueTarget, falseTarget} = monkey;
    while (items.length) {
      const i = items.shift() || BigInt(0);
      const target: bigint = opVal === 'old' ? i : opVal;
      let newValue = op === '+' ? target + i : target * i;
      if (worryFactor) {
        newValue = newValue / worryFactor;
      }
      ensure(monkeys[newValue % test ? falseTarget : trueTarget]).items.push(newValue);
      monkey.itemsInspected += 1;
    }
  });
  return monkeys;
}

function program(data: DataStringArray): Response {
  let monkeys: Monkey[] = parseMonkeys(data);
  let monkeysB: Monkey[] = parseMonkeys(data);
  const aWorry = BigInt(3);

  for (var i = 0; i < 20; i++) {
    monkeys = round(monkeys, aWorry);
  }

  for (var i = 0; i < 10000; i++) {
    console.log(`---ROUND ${i + 1}---`)
    monkeysB = round(monkeysB, null);
  }

  return [
    monkeys.map((m) => m.itemsInspected).sort((a, b) => b - a).slice(0, 2).reduce((acc, curr) => acc * curr, 1),
    monkeysB.map((m) => m.itemsInspected).sort((a, b) => b - a).slice(0, 2).reduce((acc, curr) => acc * curr, 1),
  ];
}

export function run(path: string, cb: (result: Response) => void): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

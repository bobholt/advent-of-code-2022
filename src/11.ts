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

import { List, Record } from 'immutable';
import type { RecordOf } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
// import { OrderedSet } from 'immutable';
import { Brand, ensure } from '../lib/util.js';

type Response = readonly [number, number];

type MonkeyProps = {
  items: List<number>,
  itemsInspected: number,
  test: number,
  trueTarget: number,
  falseTarget: number,
  worry: (i: number) => number,
  toss: (i: number, t: number, tt: number, ft: number) => number,
 };
type Monkey = Brand<RecordOf<MonkeyProps>, 'Monkey'>;
const makeMonkey: Record.Factory<MonkeyProps> =
  Record({ items: List(), itemsInspected: 0, test: 0, trueTarget: 0, falseTarget: 0, worry: (_) => 0, toss: (_, __, ___, ____) => 0 });
function Monkey(r?: MonkeyProps): Monkey {
  return r ? makeMonkey(r) as Monkey : Monkey(makeMonkey());
}

const monkeyRegEx = /^Monkey (\d):{1}/;
const startingItemRegEx = /^\s{2}Starting items: (.*)/;
const operationRegEx = /^\s{2}Operation: new = old (\W{1}) (.*)/;
const testRegEx = /^\s{2}Test: divisible by (.*)/;
const trueRegEx = /^\s{4}If true: throw to monkey (\d*)/;
const falseRegEx = /^\s{4}If false: throw to monkey (\d*)/;

function parseMonkeys(data: DataStringArray): List<Monkey> {
  let monkeys: List<Monkey> = List();
  let currentMonkey: number = 0;

  data.forEach((line) => {
    if (monkeyRegEx.test(line)) {
      currentMonkey = Number(ensure(line.match(monkeyRegEx))[1]);
      return monkeys = monkeys.push(Monkey());
    }
    if (startingItemRegEx.test(line)) {
      return monkeys = monkeys.setIn([currentMonkey, 'items'], List(ensure(ensure(line.match(startingItemRegEx))[1]).split(', ')).map((v) => Number(v)));
    }
    if (operationRegEx.test(line)) {
      const [_, op, val] = ensure(line.match(operationRegEx));
      return monkeys = monkeys.setIn([currentMonkey, 'worry'], (i: number) => {
        let target: number = 0;
        if (val === 'old') {
          target = i;
        } else {
          target = Number(ensure(val));
        }
        if (op === '+') {
           return target + i;
        }
        if (op === '*') {
          return target * i
        }
        throw new Error('cannot calculate');
      });
    }
    if (testRegEx.test(line)) {
      return monkeys = monkeys.setIn([currentMonkey, 'test'], Number(ensure(line.match(testRegEx))[1]));
    }
    if (trueRegEx.test(line)) {
      return monkeys = monkeys.setIn([currentMonkey, 'trueTarget'], Number(ensure(line.match(trueRegEx))[1]));
    }
    if (falseRegEx.test(line)) {
      monkeys = monkeys = monkeys.setIn([currentMonkey, 'falseTarget'], Number(ensure(line.match(falseRegEx))[1]));
      return monkeys = monkeys.setIn([currentMonkey, 'toss'], (i: number, t: number, tt: number, ft: number) => {
        if (i % t === 0) {
          return tt;
        }
        return ft;
      });
    }
    if (line === '') return;
    throw new Error(`i don't know what to do with this: ${line}`);
  });
  return monkeys;
}

function round(monkeys: List<Monkey>, worryFactor: number): List<Monkey> {
  let newMonkeys = monkeys;
  for (let i = 0; i < newMonkeys.size; i++) {
    let currentMonkey = ensure(newMonkeys.get(i));
    currentMonkey.items.forEach((j) => {
      let newValue = Math.floor(currentMonkey.worry(j) * worryFactor);
      const monkeyToThrowTo = currentMonkey.toss(newValue, currentMonkey.test, currentMonkey.trueTarget, currentMonkey.falseTarget);
      // console.log(j, newValue, currentMonkey.test, newValue % currentMonkey.test === 0, currentMonkey.trueTarget, currentMonkey.falseTarget, monkeyToThrowTo);
      newMonkeys = newMonkeys.set(monkeyToThrowTo, ensure(newMonkeys.get(monkeyToThrowTo)).update('items', (item) => item.push(newValue)));
      currentMonkey = currentMonkey.set('items', currentMonkey.items.rest());
      currentMonkey = currentMonkey.update('itemsInspected', (v) => v + 1);
      newMonkeys = newMonkeys.set(i, currentMonkey);
    });
  }
  return newMonkeys;
}

function program(data: DataStringArray): Response {
  let monkeys: List<Monkey> = parseMonkeys(data);
  let monkeysB: List<Monkey> = monkeys;
  for (var i = 0; i < 20; i++) {
    monkeys = round(monkeys, 1 / 3);
  }
  const a = monkeys.map((m) => m.itemsInspected).sort((a, b) => b - a).take(2).reduce((acc, curr) => acc * curr, 1);

  for (var i = 0; i < 5; i++) {
    // console.log(`---ROUND ${i + 1}---`)
    monkeysB = round(monkeysB, 1);

    // monkeysB.forEach((monkey, i) => {
    //   console.log(`Monkey ${i}`, monkey.items.toJS(), monkey.itemsInspected);
    // });
  }

  const b = monkeysB.map((m) => m.itemsInspected).sort((a, b) => b - a).take(2).reduce((acc, curr) => acc * curr, 1);

  return [a, b];
}

export function run(path: string, cb: (result: Response) => void): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

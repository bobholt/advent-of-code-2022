/*
 * Advent of Code 2022 Day 1
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

// https://adventofcode.com/2022/day/1

import { List } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
import { sumNumList } from '../lib/util.js';
import type { Brand } from '../lib/util.js';

type Response = readonly [number, number];

type Inventory = Brand<List<number>, 'Inventory'>;
function Inventory(l?: List<number>): Inventory {
  return l ? l as Inventory : Inventory(List());
}

type Totals = Brand<List<number>, 'Totals'>;
function Totals(l?: List<number>): Totals {
  return l ? l as Totals : Totals(List());
}

function sumAllCalories(inventories: List<Inventory>): Totals {
  return inventories.reduce(
    (acc, curr) => acc.push(sumNumList(curr)), List()
  ) as Totals
}

function getInventories(data: DataStringArray): List<Inventory> {
  return data.reduce((acc, curr) => {
    return curr === '' ? acc.push(Inventory()) : acc.set(
      acc.size - 1,
      Inventory(acc.last<Inventory>(Inventory()).push(Number(curr)))
    );
  }, List());
}

function program(data: DataStringArray): Response {
  const orderedElfCalories = sumAllCalories(
    getInventories(data)
  ).sort((a, b) => b - a);

  return [
    sumNumList(orderedElfCalories.take(1)),
    sumNumList(orderedElfCalories.take(3))
  ] as Response;
}

export function run(path: string, cb: (result: Response) => void ): void {
  readFileToStringArray(path, (err, data: DataStringArray) => {
    if (err) throw err;
    cb(program(data));
  });
};

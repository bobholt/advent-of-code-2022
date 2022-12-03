#!/usr/bin/env ts-node

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

import { readFileToStringArray } from '../lib/io.js';
import { orZero } from '../lib/util.js';

import type { Immutable, IArray } from '../lib/immutable';

type IResponse = Immutable<[number, number]>;

function splitIntoOrderedElfCals(lines: IArray<string>): IArray<number> {
  let elfCalories: number[] = [];
  let cals: number = 0;
  lines.forEach((v: string, i: number) => {
    switch (v) {
      case '':
        elfCalories = elfCalories.concat(cals);
        cals = 0;
        break;
      default:
        cals += Number(v);
        if (i == lines.length - 1) {
          elfCalories = elfCalories.concat(cals);
        }
        break;
    }
  });
  elfCalories.sort((a, b) => b - a);
  return elfCalories;
}

function findHighestCals(elfCalories: IArray<number>): number {
  return orZero(elfCalories[0]);
}

function findTopThreeCalsSum(elfCalories: IArray<number>): number {
  return orZero(elfCalories[0]) + orZero(elfCalories[1]) + orZero(elfCalories[2]);
}

function program(data: IArray<string>): IResponse {
  const orderedElfCalories = splitIntoOrderedElfCals(data);
  return [findHighestCals(orderedElfCalories), findTopThreeCalsSum(orderedElfCalories)];
}

function run(path: string, cb: (result: IResponse) => any ): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

export { run };

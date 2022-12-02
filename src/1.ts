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

import { readFile } from '../lib/io.js';
import type { Immutable } from '../lib/immutable';

function parseFileIntoLinesArray(b: Buffer): Immutable<string[]> {
  const arr: Immutable<string[]> =  b.toString().trim().split('\n');
  return arr;
}

function splitIntoOrderedElfCals(lines: Immutable<string[]>): Immutable<number[]> {
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

function findHighestCals(elfCalories: Immutable<number[]>): number {
  return elfCalories[0] || 0;
}

function findTopThreeCalsSum(elfCalories: Immutable<number[]>): number {
  return (elfCalories[0] || 0) + (elfCalories[1] || 0) + (elfCalories[2] || 0);
}

function program(data: Buffer): Immutable<{a: number, b: number}> {
  const orderedElfCalories = splitIntoOrderedElfCals(
    parseFileIntoLinesArray(
      data
    )
  );

  const result: {a: number, b: number} = {
    a: findHighestCals(orderedElfCalories),
    b: findTopThreeCalsSum(orderedElfCalories)
  }
  return result
}

function run(path: string, cb: (result: Immutable<{a: number, b: number}>) => any ): void {
  readFile(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

export { run };

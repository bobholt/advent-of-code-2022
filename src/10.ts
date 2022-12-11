/*
 * Advent of Code 2022 Day 10
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

// https://adventofcode.com/2022/day/10

import { List } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
// import { OrderedSet } from 'immutable';
import { Brand, ensure } from '../lib/util.js';

type Response = readonly [number, number];
type Cycles = Brand<List<number>, 'Cycles'>;
function Cycles(t?: List<number> | number[]): Cycles {
  return t ? t as Cycles : Cycles(List());
}

function runOperation(op: string, num: number, c: Cycles): Cycles {
  const cycles = List(c);
  const last = ensure(cycles.last());
  switch (op) {
    case 'noop':
      return Cycles(cycles.push(last));
    case 'addx':
      return Cycles(cycles.push(last).push(last + num));
    default:
      throw new Error(`operation not allowed: ${op}`);
  }
}

function signalStrength(cycle: number, cycles: Cycles): number {
  return cycle * cycles.get(cycle - 1, 0);
}

function drawCRT(cycles: Cycles): void {
  const fullScan: List<string> = cycles.map((v, i) => {
    const horiz = i % 40;
    if (horiz >= v - 1 && horiz <= v + 1) {
      return '#';
    }
    return ' ';
  });

  const crt: string[][] = fullScan.reduce((crt, pixel, i) => {
    const row: number = Math.floor(i / 40)
    ensure(crt[row]).push(pixel);
    return crt;
  }, [[], [], [], [], [], [], []] as string[][]);

  crt.forEach((scanLine) => {
    console.log(scanLine.join(''));
  });

}

function program(data: DataStringArray): Response {
  const cycles: Cycles = data.reduce((cycles, line) => {
    const [op, num] = line.split(' ');
    return runOperation(ensure(op), Number(num), cycles);
  }, Cycles([1]))

  const a: number = [20, 60, 100, 140, 180, 220].reduce((acc, curr) => {
    return acc + signalStrength(curr, cycles);
  }, 0)

  drawCRT(cycles);

  return [a, 0];
}

export function run(path: string, cb: (result: Response) => void): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

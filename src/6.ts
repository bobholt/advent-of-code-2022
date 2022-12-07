/*
 * Advent of Code 2022 Day 6
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

// https://adventofcode.com/2022/day/6

import { Set } from 'immutable';
import { readFileToString } from '../lib/io.js';

type Response = readonly [number, number];

function detectMarker(s: string, l: number): number {
  if (Set(s.slice(0, l)).size === l) {
    return l;
  }
  return 1 + detectMarker(s.slice(1), l);
}

function program(data: string): Response {
  return [
    detectMarker(data, 4),
    detectMarker(data, 14),
  ];
}

export function run(path: string, cb: (result: Response) => void): void {
  readFileToString(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

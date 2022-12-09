/*
 * Advent of Code 2022 Day 9
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

// https://adventofcode.com/2022/day/9

import { List } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
import { OrderedSet } from 'immutable';
import { ensure } from '../lib/util.js';

type Response = readonly [number, number];
type Coord = readonly [number, number];

export function isAdjacent(head: Coord, tail: Coord): boolean {
  return Math.abs(head[0] - tail[0]) <= 1 && 
    Math.abs(head[1] - tail[1]) <= 1;
}

function move(coord: Coord, dir: string): Coord {
  switch (dir) {
    case 'R':
      return [coord[0] + 1, coord[1]];
    case 'L':
      return [coord[0] - 1, coord[1]];
    case 'U':
      return [coord[0], coord[1] + 1];
    case 'D':
      return [coord[0], coord[1] - 1];
    default:
      throw new Error('invalid direction: ' + dir);
  }
}

function moveTrailer(tail: Coord, head: Coord): Coord {
  if (isAdjacent(head, tail)) {
    return tail;
  }
  const diff: Coord = [head[0] - tail[0], head[1] - tail[1]];
  const moveX = Math.max(Math.min(diff[0], 1), -1);
  const moveY = Math.max(Math.min(diff[1], 1), -1);
  const newTail: Coord = [tail[0] + moveX, tail[1] + moveY];
  return newTail;
}

function rope(knots: number, data: DataStringArray): number {
  let allCoords: List<Coord> = List();
  for (let i = 0; i < knots; i++) {
    allCoords = allCoords.push([0, 0]);
  }

  let tailVisits: OrderedSet<string> = OrderedSet();

  data.forEach((line) => {
    const splitLine = line.split(' ');
    const dir = ensure(splitLine[0]);
    const dist = Number(ensure(splitLine[1]));
    for (let i = 0; i < dist; i++) {
      allCoords.forEach((c, i) => {
        if (i === 0) {
          allCoords = allCoords.set(0, move(c, dir));
        } else {
          allCoords = allCoords.set(i, moveTrailer(c, ensure(allCoords.get(i - 1))));
        }
      });
      tailVisits = tailVisits.add(ensure(allCoords.last()).toString());
    }
  });

  return tailVisits.size;
}


function program(data: DataStringArray): Response {
  return [rope(2, data), rope(10, data)];
}

export function run(path: string, cb: (result: Response) => void ): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

/*
 * Advent of Code 2022 Day 8
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

// https://adventofcode.com/2022/day/8

import { List } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
import { Brand, ensure } from '../lib/util.js';

type Response = readonly [number, number];
type Coord = [number, number];
type Surroundings = [Trees, Trees, Trees, Trees];
type Size = [number, number];

type Trees = Brand<List<number>, "Trees">;
function Trees(t?: List<number> | number[]): Trees {
  return t ? t as Trees : Trees(List());
}
function getX(i: number, width: number): number {
  return i % width;
}
function getY(i: number, height: number): number {
  return Math.floor(i / height);
}

function isVisible(treeHeight: number, trees: Surroundings): boolean {
  const visible = Math.max(...List(trees[0]).toArray()) < treeHeight ||
    Math.max(...List(trees[1]).toArray()) < treeHeight ||
    Math.max(...List(trees[2]).toArray()) < treeHeight ||
    Math.max(...List(trees[3]).toArray()) < treeHeight
  return visible;
}

// returns trees in order moving AWAY from the coord
function getSurroundings(coord: Coord, trees: Trees, groveSize: Size): Surroundings {
  const [groveHeight, groveWidth] = groveSize
  const treesNorth = trees.filter((_, i) => {
    return getX(i, groveWidth) === coord[0] && 
      getY(i, groveHeight) < coord[1];
  }).reverse();
  const treesSouth = trees.filter((_, i) => {
    return getX(i, groveWidth) === coord[0] && 
      getY(i, groveHeight) > coord[1];
  });
  const treesEast = trees.filter((_, i) => {
    return getX(i, groveWidth) > coord[0] &&
      getY(i, groveHeight) === coord[1];
  });
  const treesWest = trees.filter((_, i) => {
    return getX(i, groveWidth) < coord[0] &&
      getY(i, groveHeight) === coord[1];
  }).reverse();
  return [treesNorth, treesSouth, treesEast, treesWest];
}

function getScore(treeHeight: number, trees: Surroundings): number {
  let score = 1;
  trees.forEach((dir) => {
    let blocked = false;
    let localScore = 0;
    dir.forEach((tree) => {
      if (blocked) return;
      if (tree < treeHeight) {
        localScore += 1;
      } if (tree >= treeHeight) {
        localScore += 1;
        blocked = true;
      }
    });
    score *= localScore;
  });
  return score;
}

function program(data: DataStringArray): Response {
  const width = ensure(data.get(0)).length;
  const height = data.size;
  const groveSize: Size = [width, height];

  const trees: Trees = Trees(data
    .reduce((str, curr) => str += curr, '')
    .trim()
    .split('')
    .map((v) => Number(v))
  );

  return trees.reduce((acc, curr, i) => {
    const coord: Coord = [getX(i, width), getY(i, height)];
    const surroundings = getSurroundings(coord, trees, groveSize);
    const scenicScore = getScore(curr, surroundings);
    if (isVisible(curr, surroundings)) {
      acc = [acc[0] + 1, acc[1]];
    }
    return [acc[0], Math.max(acc[1], scenicScore)];
  }, [0, 0]);
}

export function run(path: string, cb: (result: Response) => void ): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

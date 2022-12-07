/*
 * Advent of Code 2022 Day 7
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

// https://adventofcode.com/2022/day/7

import { List, Map } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
import { ensure } from '../lib/util.js';

type Response = readonly [number, number];

const isCD = /^\$ cd (.*)/;
const isFile = /^(\d*) (.*)/;

const totalDiskSpace: number = 70000000;
const spaceRequired: number = 30000000;

function parseFileSystem(data: DataStringArray): Map<string, number> {
  let pwd: List<string> = List();
  let allDirInfo: Map<string, number> = Map();
  data.forEach((line) => {
    const cdMatch = line.match(isCD);
    if (cdMatch != null) {
      const path = ensure(cdMatch[1]);
      pwd = path === '..' ? pwd.pop() : pwd.push(path);
      return;
    }

    const fileMatch = line.match(isFile);
    if (fileMatch != null) {
      const size = Number(ensure(fileMatch[1]));
      let cwd: List<string> = List();
      pwd.forEach((dir: string) => {
        cwd = cwd.push(cwd.last('') + dir)
        allDirInfo = allDirInfo.update(cwd.join('/'), 0, (val) => val + size);
      });
      return;
    }
  });
  return allDirInfo;
}

function program(data: DataStringArray): Response {
  const allDirInfo = parseFileSystem(data);
  const spaceUsed = ensure(allDirInfo.get('/'));
  const spaceRemaining = totalDiskSpace - spaceUsed;
  const spaceToClear = spaceRequired - spaceRemaining;
  return [
    allDirInfo.filter((size) => size <= 100000).reduce((acc, curr) => curr + acc, 0),
    allDirInfo.filter((size) => size >= spaceToClear).sort((a, b) => a - b).first(),
  ];
}

export function run(path: string, cb: (result: Response) => void ): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

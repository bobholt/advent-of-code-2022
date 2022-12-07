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

import { Record, List, Map } from 'immutable';
import type { RecordOf } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
import { Brand, ensure } from '../lib/util.js';

type Response = readonly [number, number];

type FileProps = { name: string, size: number };
type File = Brand<RecordOf<FileProps>, 'File'>;
const makeFile: Record.Factory<FileProps> = Record({ name: '', size: 0 });
function File(r?: FileProps): File {
  return r ? makeFile(r) as File : File(makeFile());
}

type Directory = Brand<Map<string, File | Directory>, 'Directory'>;
function Directory(d?: Map<string, File | Directory>): Directory {
  return d ? d as Directory : Directory(Map());
}

const isCD = /^\$ cd (.*)/;
const isLS = /^\$ ls/;
const isDir = /^dir (.*)/;
const isFile = /^(\d*) (.*)/;

const totalDiskSpace: number = 70000000;
const spaceRequired: number = 30000000;

function parseFileSystem(data: DataStringArray): [Directory, Map<string, number>] {
  let pwd: List<string> = List();
  let fs: Directory = Directory();
  let allDirInfo: Map<string, number> = Map();
  let inLS: boolean = false;
  data.forEach((line) => {
    const cdMatch = line.match(isCD);
    if (cdMatch != null) {
      const path = ensure(cdMatch[1]);
      inLS = false;
      pwd = path === '..' ? pwd.pop() : pwd.push(path);
      return;
    }

    // do not set to result of test because we only want to flag on here
    if (isLS.test(line)) {
      inLS = true;
      return;
    }

    const dirMatch = line.match(isDir);
    if (inLS && dirMatch != null) {
      const dirName = ensure(dirMatch[1]);
      fs = fs.setIn(pwd.push(dirName), Directory());
      return;
    }

    const fileMatch = line.match(isFile);
    if (inLS && fileMatch != null) {
      const fileName = ensure(fileMatch[2]);
      const size = Number(ensure(fileMatch[1]));
      fs = fs.setIn(pwd.push(fileName), File({ name: fileName, size }));
      let cwd: List<string> = List();
      pwd.forEach((dir: string) => {
        cwd = cwd.push(cwd.last('') + dir)
        allDirInfo = allDirInfo.update(cwd.join('/'), 0, (val) => val + size);
      });
      return;
    }
  });
  return [fs, allDirInfo];
}

function program(data: DataStringArray): Response {
  const [_, allDirInfo] = parseFileSystem(data);
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

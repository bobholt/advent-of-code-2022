/*
 * Advent of Code 2022 Day 4
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

// https://adventofcode.com/2022/day/4

import { List, Record } from 'immutable';
import type { RecordOf } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import { ensure } from '../lib/util.js';

type Response = readonly [number, number];
type FileData = List<string>;

type AssignmentProps = { min: number, max: number };
type Assignment = RecordOf<AssignmentProps>;
const makeAssignment: Record.Factory<AssignmentProps> =
  Record({ min: 0, max: 0 });

function isFullOverlap(a1: Assignment, a2: Assignment): boolean {
  return (a1.min <= a2.min && a1.max >= a2.max) ||
    (a1.min >= a2.min && a1.max <= a2.max);
}

function isAnyOverlap(a1: Assignment, a2: Assignment): boolean {
  return (a1.min <= a2.min && a1.max >= a2.min) ||
    (a1.min <= a2.max && a1.max >= a2.max) ||
    (a1.min >= a2.min && a1.max <= a2.max);
}

function testAssignments(data: FileData, test: Function): number {
  return data.reduce((acc, curr) => {
    const [a1, a2] = lineToAssignments(curr);
    if (test(a1, a2)) {
      return acc + 1;
    }
    return acc;
  }, 0)
}

function stringToAssignment(a: string): Assignment {
  const [min, max] = a.split('-');
  return makeAssignment({ min: Number(min), max: Number(max) })
}

function lineToAssignments(row: string): [Assignment, Assignment] {
  const [a1, a2] = row.split(',');
  return [stringToAssignment(ensure(a1)), stringToAssignment(ensure(a2))];
}

function program(data: FileData): Response {
  return [
    testAssignments(data, isFullOverlap),
    testAssignments(data, isAnyOverlap),
  ];
}

export function run(path: string, cb: (result: Response) => void): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

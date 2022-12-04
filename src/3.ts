/*
 * Advent of Code 2022 Day 3
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

// https://adventofcode.com/2022/day/3

import { readFileToStringArray } from '../lib/io.js';
import { ensure } from '../lib/util.js';
import { List, Set } from 'immutable';

type Response = readonly [number, number];
type Compartment = Set<string>;
type Rucksack = List<Compartment>;
type Elf = Set<string>;
type ElfGroup = List<Elf>;

const alphabetLower = 'abcdefghijklmnopqrstuvwxyz';
const alphabetUpper = alphabetLower.toUpperCase();

export function itemValue(char: string): number {
  const lowerPosition = alphabetLower.indexOf(char) + 1;
  const upperPosition = alphabetUpper.indexOf(char) + 1;
  return lowerPosition === 0 ? upperPosition + 26 : lowerPosition;
}

function intersection<T>(l: List<Set<T>>): T {
  return ensure(Set.intersect<T>(l).first());
}

export function makeRucksack(data:string): Rucksack {
  const compartmentLength = data.length / 2;
  let ruck: List<Set<string>> = List();
  ruck = ruck.push(Set(data.slice(0, compartmentLength)));
  ruck = ruck.push(Set(data.slice(compartmentLength)));
  return ruck;
}

function makeElfGroups(data: List<string>): List<ElfGroup> {
  let i = 0;
  let groups: List<ElfGroup> = List();
  while (i < data.size) {
    let eg: ElfGroup = List();
    for (let j = 0; j < 3; j++) {
      eg = eg.push(Set(ensure(data.get(i + j))));
    }
    groups = groups.push(eg);
    i += 3;
  }
  return groups;
}

function program(data: List<string>): Response {
  const errorSum = data.reduce((acc, curr) => {
    const ruck = makeRucksack(curr);
    const badItem = intersection(ruck);
    const priority = itemValue(badItem);
    return acc + priority;
  }, 0)

  const elfGroups = makeElfGroups(data);
  const badgeSum = elfGroups.reduce((acc, curr) => {
    const badge = intersection(curr);
    const priority = itemValue(badge);
    return acc + priority;
  }, 0)

  return [errorSum, badgeSum];
}

export function run(path: string, cb: (result: Response) => void ): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

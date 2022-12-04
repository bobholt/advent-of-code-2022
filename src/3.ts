#!/usr/bin/env ts-node

/*
 * Advent of Code 2022 Day 2
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

// https://adventofcode.com/2022/day/2

import { readFileToStringArray } from '../lib/io.js';
import { ensure } from '../lib/util.js';
import { List, Set } from 'immutable';

type IResponse = readonly [number, number];
type Compartment = Set<string>;
type Rucksack = readonly [Compartment, Compartment];
type Elf = string;
type ElfGroup = readonly [Elf, Elf, Elf];

const alphabetLower = 'abcdefghijklmnopqrstuvwxyz';
const alphabetUpper = alphabetLower.toUpperCase();

export function itemValue(char: string): number {
  const lowerPosition = alphabetLower.indexOf(char) + 1;
  const upperPosition = alphabetUpper.indexOf(char) + 1;
  return lowerPosition === 0 ? upperPosition + 26 : lowerPosition;
}

export function findError(r: Rucksack): string {
  return ensure(Set.intersect<string>([r[0], r[1]]).first());
}

export function findBadge(eg: ElfGroup): string {
  for (const elem of eg[2].split('')) {
    if (eg[0].includes(elem) && eg[1].includes(elem)) {
      return elem;
    }
  }
  throw new Error('no badge');
}

export function makeRucksack(data:string): Rucksack {
  const compartmentLength = data.length / 2;
  const c1 = data.slice(0, compartmentLength);
  const c2 = data.slice(compartmentLength);
  return [Set(c1), Set(c2)];
}

function makeElfGroups(data: List<string>): List<ElfGroup> {
  let i = 0;
  let groups: ElfGroup[] = [];
  while (i < data.size) {
    const eg: ElfGroup = [ensure(data.get(i)), ensure(data.get(i + 1)), ensure(data.get(i + 2))];
    groups.push(eg);
    i += 3;
  }
  return List(groups);
}

function program(data: List<string>): IResponse {
  const errorSum = data.reduce((acc, curr) => {
    const ruck = makeRucksack(curr);
    const badItem = findError(ruck);
    const priority = itemValue(badItem);
    return acc + priority;
  }, 0)

  const elfGroups = makeElfGroups(data);
  const badgeSum = elfGroups.reduce((acc, curr) => {
    const badge = findBadge(curr);
    const priority = itemValue(badge);
    return acc + priority;
  }, 0)

  return [errorSum, badgeSum];
}

function run(path: string, cb: (result: IResponse) => any ): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

export { run };

/*
 * Advent of Code 2022 Day 5
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

// https://adventofcode.com/2022/day/5

import { List, Stack } from 'immutable';
import { readFileToStringArray } from '../lib/io.js';
import type { DataStringArray } from '../lib/io.js';
import type { Brand } from '../lib/util.js';
import { ensure } from '../lib/util.js';

type Response = readonly [string, string];

type Crate = string;

type Tier = Brand<List<Crate>, 'Tier'>
function Tier(l?: List<Crate>): Tier {
  return l ? l as Tier : Tier(List());
}

type Tiers = Brand<List<Tier>, 'Tiers'>;
function Tiers(l?: List<Tier>): Tiers {
  return l ? l as Tiers : Tiers(List());
}

type Crates = Brand<Stack<Crate>, 'Crates'>
function Crates(s?: Stack<Crate>): Crates {
  return s ? s as Crates : Crates(Stack());
}

type Ship = Brand<List<Crates>, 'Ship'>;
function Ship(l?: List<Crates>): Ship {
  return l ? l as Ship : Ship(List());
}

type Instruction = ['move', number, 'from', number, 'to', number];

type Procedure = Brand<List<Instruction>, 'Procedure'>;
function Procedure(l?: List<Instruction>): Procedure {
  return l ? l as Procedure : Procedure(List());
}

const cratesRegEx = /(?<!\d\s*)(?:(?<=\[{1})(\w{1})|    )(?= ?)/g;
const instrRegEx = /(?<=move )\d+|(?<=from )\d+|(?<=to )\d+/g;

function shipToOutput(s: Ship): string {
  return s.reduce((acc, curr) => {
    return acc + curr.first();
  }, '');
}

function run9000Procedure(f: [Ship, Procedure]): Ship {
  const [ship, procedure] = f;
  return procedure.reduce((ship, instr) => {
    const move = instr[1];
    const from = instr[3] - 1; // 0-based
    const to = instr[5] - 1;
    let newShip = ship;

    for (let i = 0; i < move; i++) {
      const crate: string = ensure(newShip.get(from)).first('');
      newShip = newShip.update(from, Crates(), (crates) => Crates(crates.shift()));
      newShip = newShip.update(to, Crates(), (crates) => Crates(crates.unshift(crate)));
    } 
    return newShip;
  }, ship)
}

function run9001Procedure(f: [Ship, Procedure]): Ship {
  const [ship, procedure] = f;
  return procedure.reduce((ship, instr) => {
    const move = instr[1];
    const from = instr[3] - 1; // 0-based
    const to = instr[5] - 1;
    let newShip = ship;

    const subset = ensure(newShip.get(from)).take(move);

    newShip = newShip.update(from, Crates(), (crates) => Crates(crates.skip(move)));
    newShip = newShip.update(to, Crates(), (crates) => Crates(subset.concat(crates)));

    return newShip;
  }, ship)
}

function shipFromTiers(t: Tiers): Ship {
  return t.reverse().reduce((ship, tier) => {
    let newShip = ship;
    tier.forEach((crate, j) => {
      newShip = newShip.update(j, Crates(), (stack) => Crates(stack.push(crate)));
    });
    newShip = Ship(newShip.map((st: Crates) => st.skipUntil((s) => s !== ' ')));
    return(newShip);
  }, Ship());
}

export function tierFromString(s: string): Tier {
  const tier = ensure(s.match(cratesRegEx));
  return Tier(List(tier.slice()).map((v) => v.replace('    ', ' ')));
}

function instructionFromString(s: string): Instruction {
  const inst = ensure(s.match(instrRegEx));
  return ['move', Number(ensure(inst[0])), 'from', Number(ensure(inst[1])), 'to', Number(ensure(inst[2]))];
}

export function parse(data: DataStringArray): [Ship, Procedure] {
  const [tiers, procedure] = data.reduce((acc, curr) => {
    if (cratesRegEx.test(curr)) {
      return [Tiers(acc[0].push(tierFromString(curr))), acc[1]];
    } else if (instrRegEx.test(curr)) {
      return [acc[0], Procedure(acc[1].push(instructionFromString(curr)))];
    }
    return acc;
  }, [Tiers(), Procedure()]);
  return [shipFromTiers(tiers), procedure];
}

function program(data: DataStringArray): Response {
  return [
    shipToOutput(run9000Procedure(parse(data))),
    shipToOutput(run9001Procedure(parse(data))),
  ];
}

export function run(path: string, cb: (result: Response) => void): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

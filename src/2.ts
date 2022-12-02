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

import { readFile } from '../lib/io.js';
import type { Immutable } from '../lib/immutable';

const score: Immutable<{}> = {
  'rock': 1,
  'paper': 2,
  'scissors': 3,
};

const rochambeau: Immutable<{}> = {
  A: 'rock',
  X: 'rock',
  B: 'paper',
  Y: 'paper',
  C: 'scissors',
  Z: 'scissors',
}

const strategy: Immutable<{}> = {
  X: 'lose',
  Y: 'draw',
  Z: 'win',
}

function parseFileIntoLinesArray(b: Buffer): Immutable<string[]> {
  const arr: Immutable<string[]> = b.toString().trim().split('\n');
  return arr;
}

function choosePlay(round: Immutable<string>): string {
  const err = new Error('could not choose play');
  const opponent = round[0] || '';
  const strat = strategy[round[2] || ''];

  switch (strat) {
    case 'win':
      switch (opponent) {
        case 'A':
          return 'B';
        case 'B':
          return 'C';
        case 'C':
          return 'A';
        default:
          throw err;
      }
    case 'lose':
      switch(opponent) {
        case 'A':
          return 'C';
        case 'B':
          return 'A';
        case 'C':
          return 'B';
        default:
          throw err;
      }
    case 'draw':
      return opponent;
    default:
      throw err;
  }
}

function findWinner(p1: string, p2: string): number {
  const err = new Error('could not determine winner');

  switch (p1) {
    case 'rock':
      switch (p2) {
        case 'rock':
          return 0;
        case 'paper':
          return 2;
        case 'scissors':
          return 1;
        default:
          throw err;
      }
    case 'paper':
      switch (p2) {
        case 'rock':
          return 1;
        case 'paper':
          return 0;
        case 'scissors':
          return 2;
        default:
          throw err;
      }
    case 'scissors':
      switch (p2) {
        case 'rock':
          return 2;
        case 'paper':
          return 1;
        case 'scissors':
          return 0;
        default:
          throw err;
      }
    default:
      throw err;
  }
}

export function scoreRound(round: Immutable<string>, rightWay: boolean): Immutable<number[]> {
  if (round.length !== 3) throw new Error("incorrect round format");

  const player1 = rochambeau[round[0] || ''];
  let player2: string;
  if (rightWay) {
    player2 = rochambeau[choosePlay(round) || ''];
  } else {
    player2 = rochambeau[round[2] || ''];
  }

  const winner = findWinner(player1, player2);

  let player1Score = score[player1];
  let player2Score = score[player2];

  if (winner === 1) {
    player1Score += 6;
  } else if (winner === 2) {
    player2Score += 6;
  } else {
    player1Score += 3;
    player2Score += 3;
  }
  return [player1Score, player2Score];
}

function scoreGame(game: Immutable<string[]>, rightWay: boolean): Immutable<number[]> {
  return game.reduce<number[]>((acc, round) => {
    const score = scoreRound(round, rightWay);
    return [(acc[0] || 0) + (score[0] || 0), (acc[1] || 0) + (score[1] || 0)];
  }, [0, 0]);
}

function program(data: Buffer): Immutable<{a: number, b: number}> {
  const game = parseFileIntoLinesArray(
    data
  );

  const result: {a: number, b: number} = {
    a: scoreGame(game, false)[1] || 0,
    b: scoreGame(game, true)[1] || 0,
  }
  return result
}

function run(path: string, cb: (result: Immutable<{a: number, b: number}>) => any ): void {
  readFile(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

export { run };

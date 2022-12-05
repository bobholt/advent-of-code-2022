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
import type { DataStringArray } from '../lib/io.js';
import { Brand, ensure } from '../lib/util.js';
import type { RecordOf } from 'immutable';
import { Map, Record } from 'immutable';

type Response = readonly [number, number];
type Scores = readonly [number, number];

type PlayProps = { name: string, score: number };
type Play = Brand<RecordOf<PlayProps>, 'Play'>;
const makePlay: Record.Factory<PlayProps> = Record({ name: '', score: 0 });
function Play(r?: PlayProps): Play {
  return r ? makePlay(r) as Play : Play(makePlay());
}

type PlayerProps = { play: Play, score: number };
type Player = Brand<RecordOf<PlayerProps>, 'Player'>;
const makePlayer: Record.Factory<PlayerProps> = Record({ play: Play(), score: 0 });
export function Player(r?: PlayerProps): Player {
  return r ? makePlayer(r) as Player : Player(makePlayer());
}

type Players = readonly [Player, Player];

type Strategy = 'win' | 'lose' | 'draw';

export const rock: Play = Play({ name: 'rock', score: 1 });
export const paper: Play = Play({ name: 'paper', score: 2 });
export const scissors: Play = Play({ name: 'scissors', score: 3 });

const rochambeau: Map<string, Play> = Map({
  A: rock,
  X: rock,
  B: paper,
  Y: paper,
  C: scissors,
  Z: scissors,
});

const strategy: Map<string, Strategy> = Map({
  X: 'lose',
  Y: 'draw',
  Z: 'win',
});

function beats(play: Play): Play {
  switch (play) {
    case rock:
      return scissors;
    case paper:
      return rock;
    case scissors:
      return paper;
    default:
      throw new Error('incompatible play type');
  }
}

function beatenBy(play: Play): Play {
  switch (play) {
    case rock:
      return paper;
    case paper:
      return scissors;
    case scissors:
      return rock;
    default:
      throw new Error('incompatible play type');
  }
}

function choosePlay(player1: Player, s: string): Play {
  const strat = strategy.get(s);

  switch (strat) {
    case 'win':
      return beatenBy(player1.play);
    case 'lose':
      return beats(player1.play);
    case 'draw':
      return player1.play;
    default:
      throw new Error('incompatible strategy');
  }
}

function findWinner(players: Players): number {
  const p1 = players[0];
  const p2 = players[1];

  if (p1.play === p2.play) {
    return 0;
  } else if (beats(p1.play) === p2.play) {
    return 1;
  } else {
    return 2;
  }
}

export function scoreRound(players: Players): Players {
  let player1: Player;
  let player2: Player;

  let winner = findWinner(players);

  if (winner === 0) {
    player1 = Player({ play: players[0].play, score: 3 });
    player2 = Player({ play: players[1].play, score: 3 });
  } else {
    player1 = Player({ play: players[0].play, score: winner === 1 ? 6 : 0 });
    player2 = Player({ play: players[1].play, score: winner === 2 ? 6 : 0 });
  }

  player1 = Player({ play: player1.play, score: player1.score + player1.play.score });
  player2 = Player({ play: player2.play, score: player2.score + player2.play.score });

  return [player1, player2];
}

function getPlayers(round: string, rightWay: boolean): Players {
  if (round.length !== 3) throw new Error("incorrect round format");

  const player1 = Player({ play: ensure(rochambeau.get(ensure(round[0]))), score: 0 });

  let player2Play: Play;
  if (rightWay) {
    player2Play = choosePlay(player1, ensure(round[2]));
  } else {
    player2Play = ensure(rochambeau.get(ensure(round[2])));
  }

  const player2 = Player({ play: player2Play, score: 0 });

  return [player1, player2];
}

function scoreGame(data: DataStringArray, rightWay: boolean): Scores {
  return data.reduce((acc, round) => {
    if (round === '') {
      return acc;
    }
    let players = getPlayers(round, rightWay);
    players = scoreRound(players);

    return [acc[0] + players[0].score, acc[1] + players[1].score];
  }, [0, 0]);
}

function program(data: DataStringArray): Response {
  return [scoreGame(data, false)[1], scoreGame(data, true)[1]]
}

function run(path: string, cb: (result: Response) => void ): void {
  readFileToStringArray(path, (err, data) => {
    if (err) throw err;
    cb(program(data));
  });
};

export { run };

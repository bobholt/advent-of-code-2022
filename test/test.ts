#!/usr/bin/env ts-node

/*
 * Advent of Code 2022 Day X
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

import type { Immutable } from '../lib/immutable';

console.log('Hello, World!');

let anys: Immutable<number[]> = [];
anys = anys.concat([1]);
anys = anys.concat([2]);
anys = anys.concat([3]);
console.log(anys);

export {};
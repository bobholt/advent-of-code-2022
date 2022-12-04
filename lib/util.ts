import type { List } from 'immutable';

export function ensure<T>(arg: T | undefined | null, msg: string = 'unexpected undefined or null'): T {
  if (arg == null) {
    throw new TypeError(msg);
  }
  return arg;
}

export function sumNumList(ns: List<number>): number {
  return ns.reduce((acc, curr) => acc + curr, 0);
}
import type { List } from 'immutable';

export type Brand<K, T> = K & { __brand: T };

export function ensure<T>(arg: T | undefined | null, msg: string = 'unexpected undefined or null'): T {
  if (arg == null) {
    throw new TypeError(msg);
  }
  return arg;
}

export function sumNumList(ns: List<number>): number {
  return ns.reduce((acc, curr) => acc + curr, 0);
}
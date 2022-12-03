export function ensure<T>(arg: T | undefined | null, msg: string = 'unexpected undefined or null'): T {
  if (arg == null) {
    throw new TypeError(msg);
  }
  return arg;
}

export function orZero(arg: number | undefined | null): number {
  return arg || 0;
}
export type Immutable<T> = {
  readonly [K in keyof T]: Immutable <T[K]>;
};

export type IArray<T> = Immutable<T[]>;
export type IObject = Immutable<object>;

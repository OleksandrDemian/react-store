export type TStoreListener<T> = (state: T) => void;

export type TStoreUpdater<T> = (curr: T) => T;

export type TStore<T> = {
  get: () => T;
  update: (updater: TStoreUpdater<T>) => void;
  subscribe: (listener: TStoreListener<T>) => VoidFunction;
};

export interface IStoreHook<T> {
  (): T;
  <R>(sel?: (store: T) => R): R;
  store: TStore<T>;
}

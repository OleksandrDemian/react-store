export type TStoreListener<T> = (state: T) => void;

export type TUpdaterCallback<T> = (curr: T) => T;

export type TStoreUpdater<T> = (updater: TUpdaterCallback<T> | T) => void;

export type TStore<T> = {
  get: () => T;
  subscribe: (listener: TStoreListener<T>) => VoidFunction;
};

export interface IStoreHook<T> {
  (): T;
  <R>(sel?: (store: T) => R): R;
}

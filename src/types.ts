export interface IStoreListener<T> {
  (state: T): void;
}

export interface IUpdaterCallback<T> {
  (curr: T): T;
}

export interface IStoreUpdater<T> {
  (updater: IUpdaterCallback<T> | T): void;
}

export interface IStore<T> {
  get: () => T;
  subscribe: (listener: IStoreListener<T>) => VoidFunction;
};

export interface IStoreHook<T> {
  (): T;
  <R>(sel?: (store: T) => R): R;
}

export type CreatedStore<T> = [IStoreHook<T>, IStoreUpdater<T>, IStore<T>];

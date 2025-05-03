export type TStoreListener<T> = (state: T) => void;

export type TStoreUpdater<T> = T | ((curr: T) => T);

export interface IStoreHook<T> {
  (): T;
  store: {
    get(): T;
    update(updater: TStoreUpdater<T>): void;
    subscribe(listener: TStoreListener<T>): VoidFunction;
  }
}

export type TStoreContext<T> = {
  listeners: Set<VoidFunction>;
  data: T;
};

export type TStoreUpdater<T> = T | ((curr: T) => T);

export interface IStoreHook<T> {
  (): T;
  store: {
    get(): T;
    update(updater: TStoreUpdater<T>): void;
  }
}

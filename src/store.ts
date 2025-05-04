import { useSyncExternalStore } from "react";
import { IStoreHook, TStoreListener, TStoreUpdater } from "./types";

export const createStore = <T extends object>(initialValue: T): IStoreHook<T> => {
  const listeners = new Set<TStoreListener<T>>();
  let data = initialValue;

  const subscribe = (callback: TStoreListener<T>) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };
  const trigger = (data: T) => {
    listeners.forEach(l => l(data));
    return true;
  };
  const update = (updater: TStoreUpdater<T>) => {
    data = updater(data);
    trigger(data);
  };

  const getSnaphsot = <R>(sel?: (store: T) => R) => () => {
    return sel ? sel(data) : data;
  };

  const hook: IStoreHook<T> = <R>(sel?: (store: T) => R) => {
    return useSyncExternalStore(subscribe, getSnaphsot(sel), getSnaphsot(sel));
  };

  hook.store = {
    get: () => data,
    update,
    subscribe: (listener: TStoreListener<T>) => {
      listener(data);
      return subscribe(listener);
    },
  };

  return hook;
};
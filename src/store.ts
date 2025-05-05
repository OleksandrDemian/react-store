import { useSyncExternalStore } from "react";
import { IStoreHook, TStore, TStoreListener, TUpdaterCallback, TStoreUpdater } from "./types";

export const createStore = <T>(initialValue: T): [IStoreHook<T>, TStoreUpdater<T>, TStore<T>] => {
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

  const update = (updater: TUpdaterCallback<T>) => {
    data = typeof updater === "function" ? updater(data) : updater;
    trigger(data);
  };

  const getSnaphsot = <R>(sel?: (store: T) => R) => () => {
    return sel ? sel(data) : data;
  };

  const hook = <R>(sel?: (store: T) => R) => {
    return useSyncExternalStore(subscribe, getSnaphsot(sel), getSnaphsot(sel));
  };

  return [hook, update, {
    get: () => data,
    subscribe: (listener: TStoreListener<T>) => {
      listener(data);
      return subscribe(listener);
    },
  }];
};

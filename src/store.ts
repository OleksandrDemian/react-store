import { useSyncExternalStore } from "react";
import { IStoreListener, IUpdaterCallback, CreatedStore } from "./types";

export const createStore = <T>(initialValue: T): CreatedStore<T> => {
  const listeners = new Set<IStoreListener<T>>();
  let data = initialValue;

  const subscribe = (callback: IStoreListener<T>) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  const trigger = (data: T) => {
    listeners.forEach(l => l(data));
    return true;
  };

  const update = (updater: IUpdaterCallback<T>) => {
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
    subscribe: (listener: IStoreListener<T>) => {
      listener(data);
      return subscribe(listener);
    },
  }];
};

import { useMemo, useSyncExternalStore } from "react";
import { IStoreHook, TStoreListener, TStoreUpdater } from "./types";

export const createStore = <T extends object>(initialValue: T) => {
  const listeners = new Set<TStoreListener<T>>();
  let data = initialValue;

  const subscribe = (callback: TStoreListener<T>) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };
  const get = () => data;
  const update = (updater: TStoreUpdater<T>) => {
    if (typeof updater === "function") {
      data = updater(data);
    } else {
      data = updater;
    }

    trigger(data);
  };
  const trigger = (data: T) => {
    listeners.forEach(l => l(data));
    return true;
  };

  const hook: IStoreHook<T> = () => {
    const s = useSyncExternalStore<T>(subscribe, get, get);

    const proxy = useMemo(() => new Proxy(s, {
      get: (_, prop) => {
        return data[prop];
      },
      set: (_, prop, value) => {
        data = {
          ...data,
          [prop]: value,
        };
        return trigger(data);;
      }
    }), [s]);

    return proxy;
  };

  hook.store = {
    get,
    update,
    subscribe: (listener: TStoreListener<T>) => {
      listener(get());
      return subscribe(listener);
    }
  };

  return hook;
};

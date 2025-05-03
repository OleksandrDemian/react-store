import { useMemo, useSyncExternalStore } from "react";
import { IStoreHook, TStoreListener, TStoreUpdater } from "./types";

export const createStore = <T extends object>(initialValue: T) => {
  const listeners = new Set<TStoreListener<T>>();
  let data = initialValue;

  const get = () => data;
  const subscribe = (callback: TStoreListener<T>) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };
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
    const stored = useSyncExternalStore<T>(subscribe, get, get);

    const proxy = useMemo(() => new Proxy(stored, {
      get: (target, prop) => {
        return target[prop];
      },
      set: (target, prop, value) => {
        target[prop] = value;
        // @ts-ignore
        data = Array.isArray(data) ? [...data] : {...data};
        return trigger(data);
      }
    }), [stored]);

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

import { useMemo, useSyncExternalStore } from "react";
import { IStoreHook, TStoreContext, TStoreUpdater } from "./types";

export const createStore = <T extends object>(initialValue: T) => {
  const context: TStoreContext<T> = {
    listeners: new Set<VoidFunction>(),
    data: initialValue,
  };

  const subscribe = (callback: VoidFunction) => {
    context.listeners.add(callback);
    return () => context.listeners.delete(callback);
  };

  const trigger = () => {
    context.listeners.forEach(l => l());
  };

  const get = () => context.data;
  const update = (updater: TStoreUpdater<T>) => {
    if (typeof updater === "function") {
      context.data = updater(context.data);
    } else {
      context.data = updater;
    }

    trigger();
  };

  const hook: IStoreHook<T> = () => {
    const data = useSyncExternalStore<T>(subscribe, get, get);

    const proxy = useMemo(() => new Proxy(data, {
      get: (_, prop) => {
        return (context.data as any)[prop];
      },
      set: (_, prop, value) => {
        context.data = {
          ...context.data,
          [prop]: value,
        };
        trigger();
        return true;
      }
    }), [data]);

    return proxy;
  };
  hook.store = { get, update };

  return hook;
};

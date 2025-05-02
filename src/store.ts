import { useCallback, useSyncExternalStore } from "react";
import { THookUtils, TStoreContext } from "./types";

export const creatStore = <T extends object>(initialValue: T) => {
  const context: TStoreContext<T> = {
    listeners: new Set<VoidFunction>(),
    data: initialValue,
  };

  const subscribe = (callback: VoidFunction) => {
    context.listeners.add(callback);
    return () => context.listeners.delete(callback);
  };

  const triggerListeners = () => {
    context.listeners.forEach(l => l());
  };

  const get = () => context.data;

  function hook (withUtils: true): [T, THookUtils<T>];
  function hook (withUtils?: false): T;
  function hook (withUtils?: boolean) {
    const data = useSyncExternalStore<T>(subscribe, get, get);
    
    const update = useCallback((fn: (cur: T) => T) => {
      context.data = fn(context.data);
      triggerListeners();
    }, []);

    const proxy = new Proxy(data, {
      get: (_, prop) => {
        return (context.data as any)[prop];
      },
      set: (_, prop, value) => {
        context.data = {
          ...context.data,
          [prop]: value,
        };
        triggerListeners();
        return true;
      }
    });

    if (withUtils) {
      return [proxy, { update }];
    } else {
      return proxy;
    }
  }

  return hook;
};

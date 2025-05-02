export type TStoreContext<T> = {
  listeners: Set<VoidFunction>;
  data: T;
};

export type THookUtils<T> = {
  update: (fn: (cur: T) => T) => void;
};

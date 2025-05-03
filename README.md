# 🧠 **@odemian/react-store**

🌍 The smallest and simplest global state manager for React

React has no shortage of state management libraries. From the heavyweight champion Redux to modern solutions like Zustand and Valtio, you’ve got options — sometimes too many. But what if you want something super tiny, fully type-safe, and feels like magic to use?

`@odemian/react-store` is a global state manager that weighs less than ~1KB, has zero dependencies, and gives you reactive state via JavaScript proxies ✨.

## 🚀 Features

* ✅ **Tiny**: less than 1KB, no dependencies
* 🧩 **Simple API**: create and use stores in just a few lines
* 🪞 **Proxy-based reactivity**: directly mutate values like `user.name = "Jane"`
* 🔄 **Hooks-friendly**: built on `useSyncExternalStore` for maximum React compatibility
* 🛠️ **Optional utilities**: use functional `update()` when you want more control
* ⚛️ **Works across components**: shared, reactive global state

## 📦 Installation

```bash
npm i @odemian/react-store
```


## 🧑‍💻 Usage

### 1. Create your store

```ts
// stores/userStore.ts
import { createStore } from "@odemian/react-store";

// Type safe
export const useUser = createStore<{
  name: string;
  surname: string;
}>({
  name: "",
  surname: "",
});
```

### 2. Use it in your component

```tsx
import { useUser } from "./stores/userStore";

export const UserSettings = () => {
  const user = useUser(); // no need to destructure, fully type and ready to use

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    user.name = e.currentTarget.value; // feels like magic 🔮, this mutation is reactive
  };

  return (
    <div>
      <h2>User settings</h2>
      <label htmlFor="name">User name</label>
      <input id="name" value={user.name} onChange={onChange} />
    </div>
  );
};
```

### 3. Async data fetching

```tsx
import { useUser } from "./stores/userStore";
import { fetchUser } from "./api";

export const UserSettings = () => {
  const user = useUser();

  useEffect(() => {
    fetchUser().then((newData) => {
      // every hook has static store property. This property exposes `get` and `update` utility functions
      useUser.store.update(newData); // update is reactive
      // you can also pass update function: useUser.store.update((curr) => ({ ...curr, ...newData }));
    });
  }, []);

  return (
    <div>
      <h2>User name: {user.name} {user.surname}</h2>
    </div>
  );
};
```


## 💡 Why Use This?

| Feature               | Benefit                                        |
| --------------------- | ---------------------------------------------- |
| 🚀 Fast & Lightweight | No overhead, perfect for small apps or tools   |
| 🔮 Proxy Reactivity   | Intuitive state mutation: `user.name = "Jane"` |
| ♻️ Centralized State  | Share across components with ease              |
| 🧼 Clean API          | No need for reducers, dispatch, or boilerplate |
| 🧠 Fully Type-Safe    | Typescript support built-in out of the box     |


## 📘 API Reference

### `createStore<T>(initialValue: T): IStoreHook<T>`

Creates a new global store with the given initial state.

#### Parameters

* `initialValue` (`T`): The initial state object for the store.

#### Returns

A custom React hook (`IStoreHook<T>`) that returns a **proxy-based state object** and provides static utilities via `.store`.

---

### Hook usage: `const state = useStore()`

Returns a proxy-wrapped state object.

* Mutate directly: `state.count += 1`
* All changes are reactive and automatically re-render subscribers.

---

### Static Methods

Available as `useStore.store`:

#### `store.get(): T`

Returns the current state without subscribing to updates.

#### `store.update(updater: T | (state: T) => T): void`

Updates the store:

* You can pass a partial object or a function that receives current state and returns new state.

Example:

```ts
useStore.store.update({ name: "Jane" });
useStore.store.update((curr) => ({ ...curr, name: "Jane" }));
```

#### `store.subscribe(listener: (state: T) => void): () => void`

Subscribe to state changes without using React hooks (e.g., for non-React usage or external logic).

---

### Example

```ts
const useCounter = createStore({ count: 0 });

// In a component
const counter = useCounter();
counter.count++; // Triggers reactivity

// Outside React
useCounter.store.subscribe((state) => console.log(state.count));
```

## 🛑 Caveats

* Not intended for highly complex state logic (e.g. middleware, effects)

## 📃 License

MIT

# ⚛️ **@odemian/react-store**

### A minimal, typed, selector-based global state manager for React

React has no shortage of state management libraries—from Redux to Zustand and Jotai. But sometimes all you need is a **simple**, **fast**, and **tiny** way to share state across components — without magic, proxies, or boilerplate.

`@odemian/react-store` is a minimal global state manager that:

* Weighs less than **1KB**
* Has **zero dependencies**
* Is **fully type-safe**
* Uses **selectors** for efficient state reads
* Integrates seamlessly with `useSyncExternalStore`

---

## 🚀 Features

* ✅ **Tiny**: \~300 bytes, no dependencies
* 🧼 **Clean API**: `createStore` gives you everything you need
* 🎯 **Selectors**: read only the data you care about
* 🧠 **Fully typed**: TypeScript support out of the box
* 🔁 **Reacts to changes**: Efficient updates with fine-grained subscriptions
* ♻️ **Global shared state**: Use in any component

---

## 📦 Installation

```bash
npm i @odemian/react-store
```

---

## 🧑‍💻 Usage

### 1. Create your store

```ts
// stores/userStore.ts
import { createStore } from "@odemian/react-store";

export const useUser = createStore({
  name: "",
  surname: "",
});
```

### 2. Use the store in your component

```tsx
import { useUser } from "./stores/userStore";

export const UserSettings = () => {
  const name = useUser((u) => u.name); // selector-based subscription
  const update = useUser.store.update;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update((curr) => ({ ...curr, name: e.currentTarget.value }));
  };

  return (
    <div>
      <h2>User Settings</h2>
      <label htmlFor="name">User name</label>
      <input id="name" value={name} onChange={onChange} />
    </div>
  );
};
```

### 3. Async data fetching

```tsx
import { useUser } from "./stores/userStore";
import { useEffect } from "react";
import { fetchUser } from "./api";

export const UserProfile = () => {
  const user = useUser(); // no selector: returns the whole store

  useEffect(() => {
    fetchUser().then((data) => {
      useUser.store.update(() => data);
    });
  }, []);

  return (
    <div>
      <h2>{user.name} {user.surname}</h2>
    </div>
  );
};
```

---

## 🧠 Why Use This?

| Feature               | Benefit                                   |
| --------------------- | ----------------------------------------- |
| ⚡️ Ultra-lightweight  | Minimal size, ideal for small to mid apps |
| 🔎 Selector Support   | Only rerender on relevant state changes   |
| 💡 Simple & Explicit  | No proxies, no magic — just plain JS/TS   |
| 🧼 Type-safe & clean  | Fully typed from store to component       |
| ♻️ Global React State | Share state across components with ease   |

---

## 📘 API Reference

### `createStore<T>(initialValue: T): IStoreHook<T>`

Creates a global store with the given initial state.

#### Returns

A hook that:

* Subscribes to updates (`useStore(selector?)`)
* Exposes static methods via `useStore.store`

---

### 🔁 Hook Usage

#### `const state = useStore()`

Returns the full state object.

#### `const value = useStore(selector)`

Reads a selected part of state. Component only rerenders if selected value changes.

Example:

```ts
const name = useUser((u) => u.name);
```

---

### 🧩 Static Methods

Accessible via `useStore.store`:

#### `get(): T`

Returns the current state (no subscription).

#### `update(updater: (curr: T) => T): void`

Updates the store with a new value or function.

Example:

```ts
useUser.store.update((curr) => ({ ...curr, name: "Alice" }));
```

#### `subscribe(listener: (state: T) => void): () => void`

Subscribe to store changes manually (non-React usage).

---

## 📝 Example: Todo App

```tsx
import { createStore } from "@odemian/react-store";
import { useState } from "react";

export type TTodo = {
  id: number;
  name: string;
  done: boolean;
};

export const useTodos = createStore<TTodo[]>([
  { id: Date.now(), name: "First task", done: false },
]);

export const addTodo = (name: string) =>
  useTodos.store.update((todos) => [
    ...todos,
    { id: Date.now(), name, done: false },
  ]);

export const toggleTodo = (id: number) =>
  useTodos.store.update((todos) =>
    todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  );

export const removeTodo = (id: number) =>
  useTodos.store.update((todos) => todos.filter((t) => t.id !== id));

// Components
const CreateTodo = () => {
  const [text, setText] = useState("");

  const onAddTodo = (title: string) => {
    addTodo(title);
    setText("");
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && onAddTodo(text)}
      />
      <button onClick={() => onAddTodo(text)}>Add</button>
    </div>
  );
};

const Todos = () => {
  const todos = useTodos();

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.name}
          <button onClick={() => removeTodo(todo.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export const App = () => (
  <main>
    <Todos />
    <CreateTodo />
  </main>
);
```

---

## 📃 License

MIT
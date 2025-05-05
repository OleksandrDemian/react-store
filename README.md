# ⚛️ **React store**

### A minimal, typed, selector-based global state manager for React

React has no shortage of state management libraries—from Redux to Zustand and Jotai. But sometimes all you need is a **simple**, **fast**, and **tiny** way to share state across components — without magic, proxies, or boilerplate.

`@odemian/react-store` is a minimal global state manager that:

* Weighs less than **0.5KB**
* Has **zero dependencies**
* Is **fully type-safe**
* Uses **selectors** for efficient state reads and updates
* Based on the new `useSyncExternalStore` React API

---

## 🚀 Features

* ✅ **Tiny**: \~330 bytes, no dependencies
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

export const [useUser, updateUser] = createStore({
  name: "",
  surname: "",
});
```

### 2. Use the store in your component

```tsx
import { useUser, updateUser } from "./stores/userStore";

export const UserSettings = () => {
  const name = useUser((u) => u.name); // selector-based subscription

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUser((curr) => ({ ...curr, name: e.currentTarget.value }));
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
import { useUser, updateUser } from "./stores/userStore";
import { useEffect } from "react";

const fetchUser = () => new Promise<{ name: string; surname: string; }>((r) => {
  setTimeout(() => r({ name: "Hello", surname: "world" }), 1500);
});

export const App = () => {
  const user = useUser();

  useEffect(() => {
    fetchUser().then(updateUser);
  }, []);

  return (
    <div>
      <h2>{user.name} {user.surname}</h2>
    </div>
  );
};
```

---

## 📘 API Reference

### `createStore<T>(initialValue: T): [IStoreHook<T>, TStoreUpdater<T>, TStore<T>]`

Creates a global store with the given initial state.

#### Returns

An index array with:

* Hook to be used in React components
* Update function
* Store get and subscribe methods

---

### 🔁 Hook Usage

#### `const value = useStore()`

Returns the full state object (no selector).

#### `const value = useStore(selector)`

Reads a selected part of state. Component only rerenders if selected value changes.

Example:

```ts
const name = useUser((u) => u.name); // UI render only if name changes, not entire state
```

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

export const [useTodos, updateTodo] = createStore<TTodo[]>([
  { id: Date.now(), name: "First task", done: false },
]);

export const addTodo = (name: string) =>
  updateTodo((todos) => [
    ...todos,
    { id: Date.now(), name, done: false },
  ]);

export const toggleTodo = (id: number) =>
  updateTodo((todos) =>
    todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  );

export const removeTodo = (id: number) =>
  updateTodo((todos) => todos.filter((t) => t.id !== id));

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
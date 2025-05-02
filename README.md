# 🧠 **@odemian/react-store**

> A *super tiny* (\~1KB) global state manager for React — with a twist: update state like plain objects using **proxy magic** ✨

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

export const useUserStore = createStore<{
  name: string; // typesafe
}>({
  name: "",
});
```

### 2. Use it in your component

#### 🧪 Option A: Proxy-based mutation (object-style)

```tsx
import { useUserStore } from "./stores/userStore";

export const UserSettings = () => {
  const user = useUserStore(); // no need to destructure, fully type and ready to use

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    user.name = e.currentTarget.value; // feels like magic 🔮
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

#### ⚙️ Option B: With `update()` util (functional style)

```tsx
import { useUserStore } from "./stores/userStore";

export const UserSettings = () => {
  const [user, { update }] = useUserStore(true); // true = enable utils

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update(prev => ({
      name: e.currentTarget.value,
    }));
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

## 💡 Why Use This?

| Feature               | Benefit                                        |
| --------------------- | ---------------------------------------------- |
| 🚀 Fast & Lightweight | No overhead, perfect for small apps or tools   |
| 🔮 Proxy Reactivity   | Intuitive state mutation: `user.name = "Jane"` |
| ♻️ Centralized State  | Share across components with ease              |
| 🧼 Clean API          | No need for reducers, dispatch, or boilerplate |
| 🧠 Fully Type-Safe    | Typescript support built-in out of the box     |

## 🛑 Caveats

* Not intended for highly complex state logic (e.g. middleware, effects)

## 🛠️ API Reference

### `createStore<T>(initialValue: T) => hook`

Returns a React hook

#### `const state = useStore()`

Gives a reactive **proxy object**

#### `const [state, { update }] = useStore(true)`

Gives proxy and a functional `update(fn)` util

## 📃 License

MIT

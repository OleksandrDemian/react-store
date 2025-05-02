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


## 🛑 Caveats

* Not intended for highly complex state logic (e.g. middleware, effects)

## 📃 License

MIT

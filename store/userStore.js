import create from 'zustand'
import { persist } from "zustand/middleware";


export const store = create(
    persist(
        (set, get) => ({
            user: "",
            token: "",
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token })
        }),
        {
            name: 'ideas-app-with-auth', // name of the item in the storage (must be unique)
        }
    )
)

// const useStore = create(persist(store));
//const useStore = create(store)
const userStore = store
export { userStore };
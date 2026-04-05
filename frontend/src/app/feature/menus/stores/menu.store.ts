import { create } from "zustand";
import {  MenuState, MenuStore } from "../types/MenuItem";

export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  loading: false,

  fetchMenus: async () => {
    try {
      set({ loading: true });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/menus/tree`);
      const data = await res.json();

      set({ menus: data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

export const useSelectMenu = create<MenuStore>((set) => ({
  selectedMenu: null,
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));
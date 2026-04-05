export type MenuItem = {
  id: string;
  name: string;
  depth: number;
  order: number;
  parentName: string;
  parentId: string | null;
  children?: MenuItem[];
};


export type MenuState = {
  menus: MenuItem[];
  loading: boolean;
  fetchMenus: () => Promise<void>;
};

export interface MenuStore {
  selectedMenu: MenuItem | null;
  setSelectedMenu: (menu: MenuItem | null) => void;
}
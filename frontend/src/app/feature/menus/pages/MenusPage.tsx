"use client";

import { useEffect, useState } from "react";
import { LayoutGridIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TreeNode } from "../components/TreeNode";
import { useMenuStore, useSelectMenu } from "../stores/menu.store";
import { MenuDetail } from "../components/MenuDetail";

const MenusPage = () => {
  const [globalOpen, setGlobalOpen] = useState(true);
  const [treeKey, setTreeKey] = useState(0);
  const { menus, fetchMenus, loading } = useMenuStore();
  const selectedMenu = useSelectMenu((s) => s.selectedMenu);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  function expandAll() {
    setGlobalOpen(true);
    setTreeKey((k) => k + 1);
  }

  function collapseAll() {
    setGlobalOpen(false);
    setTreeKey((k) => k + 1);
  }

  return (
    <section className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2">
        <div className="bg-blue-700 text-white p-3 rounded-full">
          <LayoutGridIcon size={20} />
        </div>
        <h1 className="text-2xl font-bold">Menus</h1>
      </div>
      <h4 className="text-sm font-medium text-gray-600">Menu</h4>
      
      <div className="w-full max-w-sm">
        <Select defaultValue="system-management">
          <SelectTrigger className="w-60">
            <SelectValue placeholder="System Management" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="system-management">
                system management
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <section className="flex items-center gap-2">
        <Button
          className="px-5 py-2 rounded-2xl bg-gray-900 hover:bg-gray-700"
          onClick={expandAll}
        >
          Expand All
        </Button>
        <Button
          className="px-5 py-2 rounded-2xl"
          variant="outline"
          onClick={collapseAll}
        >
          Collapse All
        </Button>
      </section>


      <section className="flex gap-6 items-start flex-wrap">
        <div className="mt-1 pl-1 w-100">
          {loading && <p>Loading...</p>}
          {!loading &&
            menus.map((root, idx) => (
              <TreeNode
                key={`${root.id}-${treeKey}`}
                node={root}
                depth={0}
                isLast={idx === menus.length - 1}
                parentLines={[]}
                globalOpen={globalOpen}
                onRefresh={fetchMenus}
              />
            ))}
        </div>

        <div className="flex-1 space-y-4 w-full max-w-sm">
          {selectedMenu ? (
            <>
              <MenuDetail onRefresh={fetchMenus} />
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Select a menu item to see details
            </p>
          )}
        </div>
      </section>
    </section>
  );
};

export default MenusPage;

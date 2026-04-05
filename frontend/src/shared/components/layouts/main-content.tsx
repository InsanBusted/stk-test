"use client";

import { useSidebar } from "@/shared/context/sidebar-context";
import Breadcrumb from "../ui/breadcrumbs";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();
  return (
    <main
      className="flex-1 overflow-auto transition-all duration-300"
      style={{ marginLeft: collapsed ? 92 : 232 }}
    >
      <Breadcrumb />
      <div className="px-6 pb-6">{children}</div>
    </main>
  );
}

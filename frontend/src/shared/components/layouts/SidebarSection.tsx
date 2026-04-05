"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  LayoutGrid,
  Menu,
  List,
  Users,
  Trophy,
  AlignJustify,
} from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/shared/context/sidebar-context";

const navItems = [
  { label: "Systems", icon: FolderOpen, href: "/systems" },
  { label: "System Code", icon: LayoutGrid, href: "/system-code" },
  { label: "Properties", icon: LayoutGrid, href: "/properties" },
  { label: "Menus", icon: Menu, href: "/menus" },
  { label: "API List", icon: List, href: "/api-list" },
  { label: "Users & Group", icon: Users, href: "/users-group" },
  { label: "Competition", icon: Trophy, href: "/competition" },
];

export default function SidebarSection() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        bottom: 16,
        width: collapsed ? 60 : 200,
        backgroundColor: "#1a3a8f",
        borderRadius: 16,
        boxShadow:
          "0 8px 32px rgba(26,58,143,0.35), 0 2px 8px rgba(0,0,0,0.15)",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        zIndex: 100,
      }}
      className="flex flex-col text-white"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3.5 py-4 border-b border-blue-700/30 min-h-[64px]">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="grid grid-cols-2 gap-0.5 flex-shrink-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: i % 2 === 0 ? "#60a5fa" : "#93c5fd" }}
              />
            ))}
          </div>
          <div
            className="leading-tight overflow-hidden whitespace-nowrap transition-all duration-300"
            style={{
              maxWidth: collapsed ? 0 : 120,
              opacity: collapsed ? 0 : 1,
            }}
          >
            <div className="text-[9px] font-bold text-blue-200">Solusi</div>
            <div className="text-[9px] font-bold text-blue-200">Teknologi</div>
            <div className="text-[9px] font-bold text-blue-200">Kreatif</div>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-blue-300 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors shrink-0"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-2.5 py-2.5 rounded-lg text-sm transition-all duration-150 overflow-hidden whitespace-nowrap"
              style={{
                padding: collapsed ? "9px" : "9px 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                backgroundColor: isActive ? "white" : "transparent",
                color: isActive ? "#1a3a8f" : "rgba(255,255,255,0.75)",
                fontWeight: isActive ? "600" : "400",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
              }}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span
                className="transition-all duration-300 overflow-hidden"
                style={{
                  maxWidth: collapsed ? 0 : 150,
                  opacity: collapsed ? 0 : 1,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

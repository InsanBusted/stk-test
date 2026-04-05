"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight, FileIcon, FolderIcon } from "lucide-react";

function formatLabel(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: formatLabel(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <nav className="px-6 py-4">
      <ol
        className="inline-flex items-center gap-1 h-10 px-4 bg-white border border-gray-200 rounded-xl text-sm"
        style={{ lineHeight: 1 }}
      >
        {/* Home */}
        <li className="inline-flex items-center leading-none">
          <Link
            href="/"
            className="inline-flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
          >
            <FolderIcon size={14} strokeWidth={2} />
          </Link>
        </li>

        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li
              key={crumb.href}
              className="inline-flex items-center gap-1 leading-none"
            >
              <ChevronRight
                size={14}
                strokeWidth={1.5}
                className="text-gray-300 flex-shrink-0"
              />
              {isLast ? (
                <span className="font-medium text-gray-800 whitespace-nowrap">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-gray-400 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { MenuItem } from "../types/MenuItem";
import { ChevronDown, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateMenu, useMoveMenu } from "../hooks/useMenus";
import { ConfirmModal } from "./ConfirmModal";
import { useSelectMenu } from "../stores/menu.store";

export function TreeNode({
  node,
  depth = 0,
  isLast = false,
  parentLines = [],
  globalOpen,
  onRefresh,
}: {
  node: MenuItem;
  depth?: number;
  isLast?: boolean;
  parentLines?: boolean[];
  globalOpen: boolean;
  onRefresh?: () => void;
}) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const [open, setOpen] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setSelectedMenu = useSelectMenu((s) => s.setSelectedMenu);
  

  const { submit, loading } = useCreateMenu();
  const { move } = useMoveMenu();
  

  useEffect(() => { setOpen(globalOpen); }, [globalOpen]);
  useEffect(() => { if (showInput) inputRef.current?.focus(); }, [showInput]);

  const isOpen = hasChildren ? open : false;
  const INDENT = 28;

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInput((prev) => !prev);
    setInputValue("");
  };

  const handleAddClick = () => {
    if (!inputValue.trim()) return;
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const order = (node.children?.length ?? 0) + 1;
    await submit(inputValue.trim(), order, node.id);
    setShowModal(false);
    setShowInput(false);
    setInputValue("");
    onRefresh?.();
  };

  //  Drag handle
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("menuId", node.id);
    e.dataTransfer.setData("menuParentId", node.parentId ?? "");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData("menuId");
    // Cegah drop ke diri sendiri atau parent saat ini
    if (draggedId === node.id) return;
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const draggedId = e.dataTransfer.getData("menuId");
    const draggedParentId = e.dataTransfer.getData("menuParentId");

    // Cegah drop ke diri sendiri atau ke parent yang sama
    if (draggedId === node.id) return;
    if (draggedParentId === node.id) return;

    await move(draggedId, node.id, onRefresh);
  };

  return (
    <>
      {showModal && (
        <ConfirmModal
          name={inputValue.trim()}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />
      )}

      <div className="relative">
        {/* Node row */}
        <div
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex items-center justify-between py-2 text-base text-gray-800 cursor-pointer select-none rounded-md px-2 transition
            ${isDragOver
              ? "bg-blue-50 border border-blue-300 border-dashed"
              : "hover:bg-gray-100"
            }`}
          style={{ paddingLeft: depth === 0 ? 0 : depth * INDENT }}
          onClick={() => {
            setSelectedMenu(node);
            if (hasChildren) setOpen(!open);
          }}
        >
          {/* LEFT */}
          <div className="flex items-center gap-2">
            {parentLines.map((show, i) =>
              show ? (
                <span
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-gray-300"
                  style={{ left: i * INDENT + 12 }}
                />
              ) : null,
            )}

            {depth > 0 && (
              <>
                <span
                  className="absolute bg-gray-300 w-px"
                  style={{
                    left: (depth - 1) * INDENT + 12,
                    top: 0,
                    bottom: isLast ? "50%" : 0,
                  }}
                />
                <span
                  className="absolute h-px bg-gray-300"
                  style={{
                    left: (depth - 1) * INDENT + 12,
                    width: 14,
                    top: "50%",
                  }}
                />
              </>
            )}

            <span className="w-5 h-5 flex items-center justify-center shrink-0 relative z-10">
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown size={18} className="text-gray-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                )
              ) : (
                <Minus size={14} className="text-gray-300" />
              )}
            </span>

            <span className="leading-none font-medium">{node.name}</span>
          </div>

          <Button
            className="w-7 h-7 flex items-center justify-center rounded-full primary-blue text-white shadow shrink-0"
            onClick={handlePlusClick}
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Inline input */}
        {showInput && (
          <div
            className="flex items-center gap-2 py-1 px-2"
            style={{ paddingLeft: depth === 0 ? 8 : depth * INDENT + 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddClick();
                if (e.key === "Escape") setShowInput(false);
              }}
              placeholder="Menu name..."
              className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <Button
              size="sm"
              className="primary-blue text-white text-xs px-3 py-1.5 h-auto"
              onClick={handleAddClick}
              disabled={!inputValue.trim()}
            >
              Add
            </Button>
          </div>
        )}

        {/* Children */}
        {hasChildren && isOpen && (
          <div>
            {node.children!.map((child, idx) => {
              const childIsLast = idx === node.children!.length - 1;
              return (
                <TreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  isLast={childIsLast}
                  parentLines={[...parentLines, !isLast && depth >= 0]}
                  globalOpen={globalOpen}
                  onRefresh={onRefresh}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
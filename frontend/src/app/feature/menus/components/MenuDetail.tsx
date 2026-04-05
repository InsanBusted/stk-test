"use client";

import { useState, useEffect, useEffectEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateMenu, useDeleteMenu } from "../hooks/useMenus";
import { useSelectMenu } from "../stores/menu.store";

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="text-sm text-gray-500">{label}</p>
      <input
        type="text"
        readOnly
        value={value}
        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-gray-50"
      />
    </div>
  );
}

function ConfirmModal({
  title,
  children,
  onConfirm,
  onCancel,
  loading,
  confirmClassName,
  confirmLabel,
}: {
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  confirmClassName?: string;
  confirmLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-base">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="text-sm text-gray-600">{children}</div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
            className={confirmClassName ?? "primary-blue"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Loading..." : (confirmLabel ?? "Confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MenuDetail({ onRefresh }: { onRefresh?: () => void }) {
  const selectedMenu = useSelectMenu((s) => s.selectedMenu);
  const setSelectedMenu = useSelectMenu((s) => s.setSelectedMenu);
  const { update, loading: updateLoading } = useUpdateMenu();
  const { remove, loading: deleteLoading } = useDeleteMenu();

  const [name, setName] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const syncName = useEffectEvent(() => {
    setName(selectedMenu?.name || "");
  });

  useEffect(() => {
    if (!selectedMenu) return;
    syncName();
  }, [selectedMenu]);

  if (!selectedMenu) {
    return (
      <p className="text-sm text-gray-400">Select a menu item to see details</p>
    );
  }

  const handleSave = () => {
    if (!name.trim() || name === selectedMenu.name) return;
    setShowUpdateModal(true);
  };

  const handleConfirmUpdate = async () => {
    await update(selectedMenu.id, name.trim());
    setShowUpdateModal(false);
    onRefresh?.();
  };

  const handleConfirmDelete = async () => {
    await remove(selectedMenu.id, onRefresh);
    setShowDeleteModal(false);
    setSelectedMenu(null);
  };

  return (
    <>
      {showUpdateModal && (
        <ConfirmModal
          title="Update Menu"
          onConfirm={handleConfirmUpdate}
          onCancel={() => setShowUpdateModal(false)}
          loading={updateLoading}
          confirmLabel="Save"
        >
          Rename{" "}
          <span className="font-medium text-gray-900">
            &quot;{selectedMenu.name}&quot;
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-900">
            &quot;{name.trim()}&quot;
          </span>
          ?
        </ConfirmModal>
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Menu"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleteLoading}
          confirmClassName="bg-red-600 hover:bg-red-700 text-white"
          confirmLabel="Delete"
        >
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">
            &quot;{selectedMenu.name}&quot;
          </span>
          ? This will also delete all its children.
        </ConfirmModal>
      )}

      <div>
        <ReadOnlyField label="Menu Id" value={selectedMenu.id} />
        <ReadOnlyField label="Depth" value={String(selectedMenu.depth)} />
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <ReadOnlyField
            label="Parent"
            value={selectedMenu.parentName || "No parent"}
          />
          <div className="mb-3">
            <p className="text-sm text-gray-500">Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>
          <div className="flex gap-2 w-40">
            <Button
              type="submit"
              className="rounded-full primary-blue p-6 w-full"
              disabled={updateLoading || !name.trim() || name === selectedMenu.name}
            >
              Save
            </Button>
            <Button
              type="button"
              className="rounded-full bg-red-600 hover:bg-red-700 p-6 w-full"
              disabled={deleteLoading}
              onClick={() => setShowDeleteModal(true)}
            >
              Hapus
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
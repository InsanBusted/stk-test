import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ConfirmModal({
  name,
  onConfirm,
  onCancel,
  loading,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-base">Add Menu Item</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Are you sure you want to add{" "}
          <span className="font-medium text-gray-900">&quot;{name}&quot;</span>?
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="primary-blue"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}
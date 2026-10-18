
"use client";

type ProductActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
};

export default function ProductActions({
  onEdit,
  onDelete,
  deleting,
}: ProductActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        disabled={deleting}
        className="rounded-lg bg-[#E6E0F5] px-3 py-2 text-sm font-medium text-[#655F6F] hover:bg-[#D8CDEE] disabled:opacity-50"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}

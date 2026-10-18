"use client";

import type { FormEvent } from "react";
import { FiX } from "react-icons/fi";
import type { Category } from "./CategoryTable";

type Props = {
  categories: Category[];
  editingId: number | null;
  name: string;
  parentId: string;
  saving: boolean;
  error: string;
  setName: (value: string) => void;
  setParentId: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function CategoryFormModal({
  categories,
  editingId,
  name,
  parentId,
  saving,
  error,
  setName,
  setParentId,
  onSubmit,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingId === null ? "Add Category" : "Edit Category"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-medium"
            >
              Category Name
            </label>

            <input
              id="category-name"
              autoFocus
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Women"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label
              htmlFor="parent-category"
              className="mb-2 block text-sm font-medium"
            >
              Parent Category (Optional)
            </label>

            <select
              id="parent-category"
              value={parentId}
              onChange={(event) => setParentId(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-purple-400"
            >
              <option value="">None — Main Category</option>

              {categories
                .filter((category) => category.id !== editingId)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[#292335] px-4 py-3 font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId === null
                  ? "Add Category"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
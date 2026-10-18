"use client";

import { FiEdit2, FiTrash2, FiFolder } from "react-icons/fi";

export type Category = {
  id: number;
  name: string;
  parentId: number | null;
  _count?: {
    product?: number;
  };
};

type Props = {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
};

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: Props) {
  if (categories.length === 0) {
    return (
      <div className="p-12 text-center">
        <FiFolder
          className="mx-auto mb-3 text-gray-400"
          size={36}
        />
        <h3 className="font-semibold">No categories found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Add a category to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-[#F9F7FC] text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Products</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <tr
              key={category.id}
              className="transition hover:bg-purple-50/40"
            >
              <td className="px-6 py-4">
                <p className="font-semibold">{category.name}</p>
                <p className="mt-1 text-xs text-gray-400">
                  ID: {category.id}
                </p>
              </td>

              <td className="px-6 py-4">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                  {category.parentId === null
                    ? "Main Category"
                    : "Subcategory"}
                </span>
              </td>

              <td className="px-6 py-4">
                {category._count?.product ?? 0}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    aria-label={`Edit ${category.name}`}
                    className="rounded-lg p-2 text-purple-700 hover:bg-purple-100"
                  >
                    <FiEdit2 size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(category.id)}
                    aria-label={`Delete ${category.name}`}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
"use client";

import { FiPlus, FiRefreshCw } from "react-icons/fi";

import CategoryTable from "@/components/admin/categories/CategoryTable";
import CategoryStat from "@/components/admin/categories/CategoryStat";
import CategoryFormModal from "@/components/admin/categories/CategoryFormModal";
import DeleteCategoryModal from "@/components/admin/categories/DeleteCategoryModal";
import { useCategories } from "@/components/hooks/useCategories";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    saving,
    deleting,
    error,
    setError,
    success,
    search,
    setSearch,
    showForm,
    editingId,
    deleteId,
    setDeleteId,
    name,
    setName,
    parentId,
    setParentId,
    loadCategories,
    openAddForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
    filteredCategories,
    mainCategoryCount,
    setSuccess,
  } = useCategories();

  return (
    <main className="min-h-screen bg-[#F9F7F2] p-4 text-[#292335] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-purple-600">
              ADMINISTRATION
            </p>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="mt-2 text-sm text-gray-500">
              Create and organize your store categories.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292335] px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
          >
            <FiPlus size={18} />
            Add Category
          </button>
        </header>

        <CategoryStat
          total={categories.length}
          main={mainCategoryCount}
        />

        {error && !showForm && deleteId === null && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              type="button"
              onClick={() => void loadCategories()}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">All Categories</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product categories.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                aria-label="Search categories"
                className="min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-purple-400"
              />

              <button
                type="button"
                onClick={() => void loadCategories()}
                disabled={loading}
                title="Refresh categories"
                aria-label="Refresh categories"
                className="rounded-xl border border-gray-200 p-3 hover:bg-purple-50 disabled:opacity-50"
              >
                <FiRefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Loading categories...
            </div>
          ) : (
            <CategoryTable
              categories={filteredCategories}
              onEdit={openEditForm}
              onDelete={(id) => {
                setError("");
                setSuccess("");
                setDeleteId(id);
              }}
            />
          )}
        </section>
      </div>

      {showForm && (
        <CategoryFormModal
          categories={categories}
          editingId={editingId}
          name={name}
          parentId={parentId}
          saving={saving}
          error={error}
          setName={setName}
          setParentId={setParentId}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {deleteId !== null && (
        <DeleteCategoryModal
          deleting={deleting}
          error={error}
          onConfirm={() => void handleDelete()}
          onClose={() => {
            if (deleting) return;
            setDeleteId(null);
            setError("");
          }}
        />
      )}
    </main>
  );
}
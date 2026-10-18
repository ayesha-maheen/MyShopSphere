
"use client";

import AdminHeader from "@/components/admin/shared/AdminHeader";
import PageHeading from "@/components/admin/shared/PageHeading";
import AdminMessage from "@/components/admin/shared/AdminMessage";
import RefreshButton from "@/components/admin/shared/RefreshButton";

import ProductForm from "@/components/admin/products/ProductForm";
import ProductTable from "@/components/admin/products/ProductTable";

import { useAdminProducts } from "@/components/hooks/useAdminProducts";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    form,
    setForm,
    editingId,
    deletingProductId,
    loading,
    refreshing,
    saving,
    message,
    error,
    handleRefresh,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleDelete,
  } = useAdminProducts();

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <AdminHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <PageHeading
            title="Products"
            description="Manage your store products, prices, stock and categories."
          />

          <RefreshButton
            onClick={handleRefresh}
            loading={refreshing}
          />
        </div>

        {message && (
          <AdminMessage
            type="success"
            message={message}
          />
        )}

        {error && (
          <AdminMessage
            type="error"
            message={error}
          />
        )}

        <ProductForm
          form={form}
          setForm={setForm}
          categories={categories}
          editingId={editingId}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[#292335]">
              All Products
            </h2>

            <p className="mt-1 text-sm text-[#827A8D]">
              {products.length} products in your store
            </p>
          </div>

          <ProductTable
            products={products}
            loading={loading}
            deletingId={deletingProductId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

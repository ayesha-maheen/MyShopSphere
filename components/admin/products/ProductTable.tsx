
"use client";

import AdminTable from "@/components/admin/shared/AdminTable";
import ProductActions from "./ProductActions";
import type { AdminTableColumn } from "@/components/admin/shared/AdminTable";

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  image: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  } | null;
};

type Props = {
  products: Product[];
  loading: boolean;
  deletingId: number | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  products,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  const columns: AdminTableColumn<Product>[] = [
    {
      key: "name",
      title: "Product",
      render: (product) => (
        <span className="font-medium text-[#292335]">
          {product.name}
        </span>
      ),
    },
    {
      key: "category",
      title: "Category",
      render: (product) =>
        product.category?.name ?? "Uncategorized",
    },
    {
      key: "price",
      title: "Price",
      render: (product) =>
        `Rs. ${Number(product.price).toLocaleString()}`,
    },
    {
      key: "stock",
      title: "Stock",
      render: (product) => product.stock,
    },
    {
      key: "actions",
      title: "Actions",
      render: (product) => (
        <ProductActions
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product)}
          deleting={deletingId === product.id}
        />
      ),
    },
  ];

  return (
    <AdminTable<Product>
      columns={columns}
      data={products}
      getRowKey={(product) => product.id}
      loading={loading}
      emptyTitle="No products found"
      emptyDescription="Add a product to see it here."
      minWidth="800px"
    />
  );
}

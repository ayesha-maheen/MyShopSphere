
"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  ProductFormData,
  ProductCategory,
} from "@/components/admin/products/ProductForm";

import type { Product } from "@/components/admin/products/ProductTable";

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  image: "",
  price: "",
  stock: "",
  categoryId: "",
};

async function readResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Request failed."
    );
  }

  return data;
}

async function requestData(signal?: AbortSignal) {
  const [productsResponse, categoriesResponse] = await Promise.all([
    fetch("/api/admin/products", {
      cache: "no-store",
      signal,
    }),
    fetch("/api/admin/categories", {
      cache: "no-store",
      signal,
    }),
  ]);

  const [productsData, categoriesData] = await Promise.all([
    readResponse(productsResponse),
    readResponse(categoriesResponse),
  ]);

  return {
    products: Array.isArray(productsData)
      ? productsData
      : productsData.products ?? [],
    categories: Array.isArray(categoriesData)
      ? categoriesData
      : categoriesData.categories ?? [],
  };
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");

      const data = await requestData();

      setProducts(data.products);
      setCategories(data.categories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load products."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial loading: async updates happen after the request completes.
  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialData() {
      try {
        const data = await requestData(controller.signal);

        if (controller.signal.aborted) return;

        setProducts(data.products);
        setCategories(data.categories);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Failed to load products."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => controller.abort();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      description: product.description ?? "",
      image: product.image,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: String(product.categoryId),
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving || deletingProductId !== null) return;

    const price = Number(form.price);
    const stock = Number(form.stock);
    const categoryId = Number(form.categoryId);

    if (
      !form.name.trim() ||
      !form.image.trim() ||
      !form.categoryId ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      !Number.isInteger(categoryId)
    ) {
      setError("Please enter valid product details.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: editingId !== null ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId !== null ? { id: editingId } : {}),
          name: form.name.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
          price,
          stock,
          categoryId,
        }),
      });

      await readResponse(response);

      setMessage(
        editingId !== null
          ? "Product updated successfully."
          : "Product added successfully."
      );

      setForm(EMPTY_FORM);
      setEditingId(null);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (deletingProductId !== null || saving) return;

    if (
      !window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      )
    ) {
      return;
    }

    setDeletingProductId(product.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: product.id }),
      });

      await readResponse(response);

      if (editingId === product.id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }

      setMessage("Product deleted successfully.");

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete product."
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  return {
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
  };
}


"use client";


import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { FormEvent } from "react";

import type { Category } from "@/components/admin/categories/CategoryTable";

const API_URL = "/api/admin/categories";

async function readResponse(
  response: Response
): Promise<Record<string, unknown>> {
  const data: unknown = await response.json().catch(() => ({}));

  if (!data || typeof data !== "object") {
    throw new Error("Invalid server response.");
  }

  return data as Record<string, unknown>;
}

function getError(
  data: Record<string, unknown>,
  fallback: string
): string {
  return typeof data.error === "string"
    ? data.error
    : fallback;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          getError(data, "Failed to load categories.")
        );
      }

      const list = Array.isArray(data)
        ? data
        : data.categories;

      if (!Array.isArray(list)) {
        throw new Error(
          "The server returned an invalid category list."
        );
      }

      setCategories(list as Category[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  
useEffect(() => {
  const timer = setTimeout(() => {
    void loadCategories();
  }, 0);

  return () => {
    clearTimeout(timer);
  };
}, [loadCategories]);

  function openAddForm() {
    setEditingId(null);
    setName("");
    setParentId("");
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingId(category.id);
    setName(category.name);
    setParentId(
      category.parentId == null
        ? ""
        : String(category.parentId)
    );
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanName = name.trim();

    setError("");
    setSuccess("");

    if (!cleanName) {
      setError("Please enter a category name.");
      return;
    }

    if (
      editingId !== null &&
      parentId === String(editingId)
    ) {
      setError("A category cannot be its own parent.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: editingId === null ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId !== null
            ? { id: editingId }
            : {}),
          name: cleanName,
          parentId: parentId
            ? Number(parentId)
            : null,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          getError(data, "Could not save category.")
        );
      }

      const wasEditing = editingId !== null;

      setShowForm(false);
      setEditingId(null);
      setName("");
      setParentId("");

      setSuccess(
        wasEditing
          ? "Category updated successfully."
          : "Category added successfully."
      );

      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleteId === null) return;

    setError("");
    setSuccess("");
    setDeleting(true);

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteId,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          getError(data, "Could not delete category.")
        );
      }

      setDeleteId(null);
      setSuccess("Category deleted successfully.");

      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setDeleting(false);
    }
  }

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, search]);

  const mainCategoryCount = useMemo(
    () =>
      categories.filter(
        (category) => category.parentId == null
      ).length,
    [categories]
  );

  return {
    categories,
    loading,
    saving,
    deleting,

    error,
    setError,
    success,
    setSuccess,

    search,
    setSearch,

    showForm,
    setShowForm,
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
  };
}

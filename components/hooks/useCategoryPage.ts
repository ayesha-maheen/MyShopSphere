
"use client";

import { useEffect, useMemo, useState } from "react";

import { useCategoryProducts } from "@/components/hooks/useCategoryProducts";

import {
  type Category,
  type SortOption,
  formatSlugTitle,
  getDisplayName,
  normalize,
} from "@/components/categories/CategoryUtils";

export function useCategoryPage(slugs: string[]) {
  const { products, loading, error } = useCategoryProducts(slugs);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const [categoryState, setCategoryState] = useState<{
    categories: Category[];
    loading: boolean;
    error: string;
  }>({
    categories: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Categories could not be loaded.");
        }

        const result: unknown = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Invalid categories response.");
        }

        if (!cancelled) {
          setCategoryState({
            categories: result as Category[],
            loading: false,
            error: "",
          });
        }
      } catch (err) {
        if (
          cancelled ||
          (err instanceof Error && err.name === "AbortError")
        ) {
          return;
        }

        if (!cancelled) {
          setCategoryState({
            categories: [],
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "An error occurred while loading categories.",
          });
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const rootSlug = slugs[0] ?? "";

  const rootCategory = categoryState.categories.find(
    (category) =>
      category.parentId === null &&
      normalize(category.name) === normalize(rootSlug),
  );

  const selectedCategory =
    slugs.length === 1
      ? rootCategory
      : categoryState.categories.find((category) => {
          if (!category.parent) return false;

          return (
            normalize(category.parent.name) === normalize(rootSlug) &&
            normalize(getDisplayName(category)) ===
              normalize(slugs[1] ?? "")
          );
        });

  const title = selectedCategory
    ? getDisplayName(selectedCategory)
    : formatSlugTitle(slugs[slugs.length - 1] ?? "");

  const subcategories = rootCategory?.subcategories ?? [];

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query),
    );

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      return (
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
      );
    });
  }, [products, search, sort]);

  return {
    products: visibleProducts,
    loading,
    error,
    search,
    setSearch,
    sort,
    setSort,
    categoryState,
    rootSlug,
    rootCategory,
    title,
    subcategories,
  };
}

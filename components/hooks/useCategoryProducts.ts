
"use client";

import { useEffect, useState } from "react";

export type CategoryProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
  image: string | null;
  stock: number;
  createdAt?: string;
  category?: {
    id: number;
    name: string;
    parent?: {
      id: number;
      name: string;
      parent?: {
        id: number;
        name: string;
      } | null;
    } | null;
  } | null;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getCategoryPath(category: NonNullable<CategoryProduct["category"]>) {
  const ancestors = [
    category.parent?.parent?.name,
    category.parent?.name,
    category.name,
  ].filter((name): name is string => Boolean(name));

  return ancestors.map((name, index) => {
    if (index === 0) return normalize(name);

    const parentName = ancestors[index - 1];

    if (
      name.toLowerCase().startsWith(parentName.toLowerCase()) &&
      name.length > parentName.length &&
      /^[\s-]/.test(name[parentName.length])
    ) {
      name = name.slice(parentName.length).replace(/^[\s-]+/, "");
    }

    return normalize(name);
  });
}

export function useCategoryProducts(slugs: string[]) {
  const path = slugs.map(normalize).join("/");

  const [state, setState] = useState<{
    path: string;
    products: CategoryProduct[];
    loading: boolean;
    error: string;
  }>({
    path: "",
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    if (!path) return;

    let cancelled = false;
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Products could not be loaded.");
        }

        const result: unknown = await response.json();

        const allProducts: CategoryProduct[] = Array.isArray(result)
          ? (result as CategoryProduct[])
          : typeof result === "object" &&
              result !== null &&
              "products" in result &&
              Array.isArray(result.products)
            ? (result.products as CategoryProduct[])
            : [];

        const requestedPath = path.split("/");

        const filtered = allProducts.filter((product) => {
          if (!product.category) return false;

          const categoryPath = getCategoryPath(product.category);

          // Root category: include products from its subcategories too.
          if (requestedPath.length === 1) {
            return categoryPath[0] === requestedPath[0];
          }

          // Subcategory: match the complete requested path.
          return (
            categoryPath.length >= requestedPath.length &&
            requestedPath.every(
              (slug, index) => categoryPath[index] === slug
            )
          );
        });

        if (!cancelled) {
          setState({
            path,
            products: filtered,
            loading: false,
            error: "",
          });
        }
      } catch (error) {
        if (
          cancelled ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return;
        }

        if (!cancelled) {
          setState({
            path,
            products: [],
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "An error occurred while loading products.",
          });
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [path]);

  if (!path) {
    return {
      products: [] as CategoryProduct[],
      loading: false,
      error: "",
    };
  }

  const isCurrentPath = state.path === path;

  return {
    products: isCurrentPath ? state.products : [],
    loading: !isCurrentPath || state.loading,
    error: isCurrentPath ? state.error : "",
  };
}

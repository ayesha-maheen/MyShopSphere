"use client";

import { useEffect, useState } from "react";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
  image: string | null;
  stock: number;
  category?: {
    id: number;
    name: string;
  } | null;
};

type ProductState = {
  productId: string | undefined;
  product: Product | null;
  loading: boolean;
  error: string;
};

export function useProductDetails(productId: string | undefined) {
  const [state, setState] = useState<ProductState>({
    productId: undefined,
    product: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Products load nahi ho sake.");
        }

        const products: Product[] = await response.json();

        const foundProduct = products.find(
          (item) => String(item.id) === productId
        );

        if (!foundProduct) {
          throw new Error("Product nahi mila.");
        }

        if (!cancelled) {
          setState({
            productId,
            product: foundProduct,
            loading: false,
            error: "",
          });
        }
      } catch (err) {
        if (cancelled) return;

        setState({
          productId,
          product: null,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Kuch ghalat ho gaya.",
        });
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [productId]);

  const isCurrentProduct =
    Boolean(productId) && state.productId === productId;

  if (!productId) {
    return {
      product: null,
      loading: false,
      error: "Product nahi mila.",
    };
  }

  return {
    product: isCurrentProduct ? state.product : null,
    loading: !isCurrentProduct || state.loading,
    error: isCurrentProduct ? state.error : "",
  };
}
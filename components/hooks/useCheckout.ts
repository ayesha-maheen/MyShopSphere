
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export type Product = {
  id: number;
  name: string;
  price: number | string;
  image: string | null;
  stock: number;
  category?: { name: string } | null;
};

export type CheckoutItem = {
  product: Product;
  quantity: number;
};

export function useCheckout() {
  const params = useSearchParams();
  const productId = params.get("productId");
  const selectedIdsParam = params.get("selectedIds");
  const quantityParam = Number(params.get("quantity") || "1");

  const { items: cartItems } = useCart();

  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        if (!productId && !selectedIdsParam) {
          throw new Error("Please select products from your cart.");
        }

        if (!productId && !cartItems.length) {
          throw new Error("Your cart is empty.");
        }

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const products: Product[] = await response.json();

        let selected: CheckoutItem[];

        if (productId) {
          const product = products.find(
            (item) => String(item.id) === productId
          );

          if (!product) throw new Error("Product not found.");

          selected = [
            {
              product,
              quantity:
                Number.isSafeInteger(quantityParam) && quantityParam > 0
                  ? quantityParam
                  : 1,
            },
          ];
        } else {
          const selectedIds = (selectedIdsParam ?? "")
            .split(",")
            .filter(Boolean);

          if (!selectedIds.length) {
            throw new Error("Please select products from your cart.");
          }

          const selectedCartItems = cartItems.filter((item) =>
            selectedIds.includes(String(item.id))
          );

          if (selectedCartItems.length !== selectedIds.length) {
            throw new Error("Some selected cart products are unavailable.");
          }

          selected = selectedCartItems.map((item) => {
            const product = products.find(
              (p) => String(p.id) === String(item.id)
            );

            if (!product) {
              throw new Error(`${item.name} is unavailable.`);
            }

            return {
              product,
              quantity: item.quantity,
            };
          });
        }

        if (!cancelled) setCheckoutItems(selected);
      } catch (err) {
        if (!cancelled) {
          setCheckoutItems([]);
          setError(
            err instanceof Error
              ? err.message
              : "Could not load checkout."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [productId, selectedIdsParam, quantityParam, cartItems]);

  const total = checkoutItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const totalQuantity = checkoutItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const invalidStock = checkoutItems.some(
    ({ product, quantity }) =>
      quantity < 1 || quantity > product.stock
  );

  return {
    productId,
    checkoutItems,
    setCheckoutItems,
    loading,
    error,
    setError,
    total,
    totalQuantity,
    invalidStock,
  };
}

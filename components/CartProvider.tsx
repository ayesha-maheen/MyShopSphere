
"use client";

import { type ReactNode, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";

import {
  addItem,
  removeItem,
  updateItemQuantity,
  openCart as openCartAction,
  closeCart as closeCartAction,
  clearCart as clearCartAction,
  type CartProduct,
} from "@/redux/features/cart/cartSlice";

export type { CartProduct };

type CartContextType = {
  items: RootState["cart"]["items"];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  isHydrated: boolean;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

export function useCart(): CartContextType {
  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector(
    (state: RootState) => state.cart.items
  );

  const isCartOpen = useSelector(
    (state: RootState) => state.cart.isCartOpen
  );

  const isHydrated = useSelector(
    (state: RootState) => state.cart.isHydrated
  );

  const cartCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0
      ),
    [items]
  );

  return {
    items,
    cartCount,
    subtotal,
    isCartOpen,
    isHydrated,

    addToCart: (product) => dispatch(addItem(product)),
    removeFromCart: (id) => dispatch(removeItem(id)),

    updateQuantity: (id, quantity) =>
      dispatch(updateItemQuantity({ id, quantity })),

    openCart: () => dispatch(openCartAction()),
    closeCart: () => dispatch(closeCartAction()),
    clearCart: () => dispatch(clearCartAction()),
  };
}


"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";

import { store } from "./store";
import {
  hydrateCart,
  type CartItem,
} from "./features/cart/cartSlice";

const CART_STORAGE_KEY = "myshopsphere-cart";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      let validItems: CartItem[] = [];

      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          validItems = parsed.filter(
            (item): item is CartItem =>
              item !== null &&
              typeof item === "object" &&
              typeof item.id === "number" &&
              typeof item.name === "string" &&
              typeof item.price === "number" &&
              typeof item.image === "string" &&
              typeof item.quantity === "number" &&
              item.quantity > 0
          );
        }
      }

      store.dispatch(hydrateCart(validItems));
    } catch (error) {
      console.error("Could not restore the saved cart:", error);
      store.dispatch(hydrateCart([]));
    }

    const unsubscribe = store.subscribe(() => {
      try {
        const items = store.getState().cart.items;
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(items)
        );
      } catch (error) {
        console.error("Could not save the cart:", error);
      }
    });

    return unsubscribe;
  }, []);

  return (
  <Provider store={store} serverState={store.getState()}>
    {children}
  </Provider>
);
}


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
  isHydrated: boolean;
};

const initialState: CartState = {
  items: [],
  isCartOpen: false,
  isHydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartProduct>) {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      state.isCartOpen = true;
    },

    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    updateItemQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => item.id !== id
        );
        return;
      }

      const item = state.items.find(
        (product) => product.id === id
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    openCart(state) {
      state.isCartOpen = true;
    },

    closeCart(state) {
      state.isCartOpen = false;
    },

    clearCart(state) {
      state.items = [];
      state.isCartOpen = false;
    },

    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.isHydrated = true;
      state.isCartOpen = false;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  openCart,
  closeCart,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiShoppingBag,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CartItem from "@/components/cart/cartItem";
import { useCart } from "./CartProvider";

type CartProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartDrawer() {
  const router = useRouter();

  const {
    items,
    cartCount,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedItems = items.filter((item: CartProduct) =>
    selectedIds.includes(item.id)
  );

  const selectedSubtotal = selectedItems.reduce(
    (total: number, item: CartProduct) =>
      total + item.price * item.quantity,
    0
  );

  const allSelected =
    items.length > 0 && selectedItems.length === items.length;

  function handleSelect(id: number, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((itemId) => itemId !== id)
    );
  }

  function handleSelectAll(checked: boolean) {
    setSelectedIds(
      checked ? items.map((item: CartProduct) => item.id) : []
    );
  }

  function handleRemove(id: number) {
    removeFromCart(id);
    setSelectedIds((current) =>
      current.filter((itemId) => itemId !== id)
    );
  }

  function handleCheckout() {
    if (selectedItems.length === 0) return;

    const ids = selectedItems.map((item: CartProduct) => item.id);

    closeCart();

    router.push(
      `/checkout?selectedIds=${encodeURIComponent(ids.join(","))}`
    );
  }

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-black/40"
        onClick={closeCart}
        aria-label="Close cart"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#F9F7F2] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E7E0EF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#EEE8F7] p-2 text-[#75619A]">
              <FiShoppingCart size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#292335]">Your Cart</h2>
              <p className="text-xs text-[#655F6F]">
                {cartCount} item(s)
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <FiX size={20} />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <FiShoppingBag size={42} className="text-[#B8A4E3]" />

            <h3 className="mt-4 font-semibold text-[#292335]">
              Your cart is empty
            </h3>

            <p className="mt-2 text-sm text-[#655F6F]">
              Add products to start shopping.
            </p>

            <Button
              type="button"
              className="mt-5 bg-[#B8A4E3] text-[#292335] hover:bg-[#A58ED8]"
              onClick={closeCart}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-[#E7E0EF] px-5 py-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#292335]">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked === true)
                  }
                  aria-label="Select all products"
                />
                Select All
              </label>

              <span className="text-xs text-[#655F6F]">
                {selectedItems.length} of {items.length} selected
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item: CartProduct) => (
                <CartItem
                  key={item.id}
                  item={item}
                  selected={selectedIds.includes(item.id)}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </div>

            <div className="border-t border-[#E7E0EF] bg-white px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#655F6F]">
                  Selected items subtotal
                </span>

                <span className="font-bold text-[#292335]">
                  Rs. {selectedSubtotal.toLocaleString("en-PK")}
                </span>
              </div>

              <p className="mt-1 text-xs text-[#655F6F]">
                Only selected products will be checked out.
              </p>

              <Button
                type="button"
                disabled={selectedItems.length === 0}
                onClick={handleCheckout}
                className="mt-5 h-12 w-full bg-[#B8A4E3] font-semibold text-[#292335] hover:bg-[#A58ED8] disabled:opacity-50"
              >
                Checkout ({selectedItems.length})
                <FiArrowRight className="ml-2" size={17} />
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
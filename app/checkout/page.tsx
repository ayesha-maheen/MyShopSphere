
"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useCart } from "@/components/CartProvider";
import { useCheckout } from "@/components/hooks/useCheckout";
import CheckoutForm from "./checkoutForm";
import CheckoutSummary from "./checkoutSummary";

function CheckoutContent() {
  const router = useRouter();
  const { items: cartItems, removeFromCart } = useCart();

  const {
    productId,
    checkoutItems,
    loading,
    error,
    setError,
    total,
    totalQuantity,
    invalidStock,
  } = useCheckout();

  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  async function handlePlaceOrder(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return;

    setError("");

    if (!checkoutItems.length) {
      setError("No products available for checkout.");
      return;
    }

    if (invalidStock) {
      setError("One or more products have insufficient stock.");
      return;
    }

    if (!/^03[0-9]{9}$/.test(phone)) {
      setError(
        "Enter a valid 11-digit Pakistani phone number starting with 03."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
          customerName: customerName.trim(),
          phone,
          address: address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order could not be placed.");
      }

      const orderId = data.order?.id ?? data.id;

      if (!orderId) {
        throw new Error("Order number was not returned.");
      }

      if (!productId) {
        checkoutItems.forEach(({ product }) => {
          const cartItem = cartItems.find(
            (item) => String(item.id) === String(product.id)
          );

          if (cartItem) removeFromCart(cartItem.id);
        });
      }

      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F9F7F2] text-[#75619A]">
        Loading checkout...
      </main>
    );
  }

  if (!checkoutItems.length) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F9F7F2] px-4">
        <p className="text-center text-[#292335]">
          {error || "Your cart is empty."}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-[#B8A4E3] px-5 py-3 font-semibold text-[#292335] transition hover:bg-[#A58ED8]"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F7F2] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href={productId ? `/products/${productId}` : "/"}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#75619A]"
        >
          <FiArrowLeft />
          Back to Shopping
        </Link>

        <h1 className="text-3xl font-black text-[#292335] sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-[#655F6F]">
          Enter your delivery details to place your order.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <CheckoutForm
            customerName={customerName}
            setCustomerName={setCustomerName}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            error={error}
            submitting={submitting}
            invalidStock={invalidStock}
            total={total}
            onSubmit={handlePlaceOrder}
          />

          <CheckoutSummary
            items={checkoutItems}
            total={total}
            totalQuantity={totalQuantity}
          />
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F9F7F2] text-[#75619A]">
          Loading checkout...
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

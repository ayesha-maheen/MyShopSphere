
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrdersContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F7F2] px-4 py-12 text-[#292335]">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          ✓
        </div>

        <h1 className="mb-3 text-3xl font-bold">
          Order Received!
        </h1>

        <p className="mb-5 text-gray-600">
          Thank you for shopping with MyShopSphere.
          Your order has been submitted successfully.
        </p>

        {orderId && (
          <p className="mb-5 rounded-xl bg-violet-50 p-3 font-semibold">
            Order Number: #{orderId}
          </p>
        )}

        <p className="mb-6 text-sm text-gray-500">
          Your order status is pending confirmation.
        </p>

        <Link
          href="/"
          className="inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">Loading...</div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiPackage } from "react-icons/fi";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F7F2] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#E7E0EF] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EEE8F7]">
          <FiCheckCircle className="h-10 w-10 text-[#75619A]" />
        </div>

        <h1 className="mt-6 text-3xl font-black text-[#292335]">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#655F6F]">
          Thank you for shopping with MyShopSphere.
          Your order has been received successfully.
        </p>

        {orderId && (
          <div className="mt-6 rounded-xl bg-[#F9F7F2] p-4">
            <p className="text-sm text-[#655F6F]">
              Your Order Number
            </p>
            <p className="mt-1 text-xl font-bold text-[#75619A]">
              #{orderId}
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[#655F6F]">
          <FiPackage className="h-5 w-5" />
          <span>Payment Method: Cash on Delivery</span>
        </div>

        <p className="mt-3 text-sm text-[#655F6F]">
          Please keep your phone available for delivery updates.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-[#B8A4E3] px-6 py-3 font-bold text-[#292335] transition hover:bg-[#A58ED8]"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F9F7F2] text-[#292335]">
          Loading...
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
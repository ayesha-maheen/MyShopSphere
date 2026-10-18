
"use client";

import type { FormEvent } from "react";
import { FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";

type Props = {
  customerName: string;
  setCustomerName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  error: string;
  submitting: boolean;
  invalidStock: boolean;
  total: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function CheckoutForm({
  customerName,
  setCustomerName,
  phone,
  setPhone,
  address,
  setAddress,
  error,
  submitting,
  invalidStock,
  total,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-[#E7E0EF] bg-white p-5 sm:p-8"
    >
      <h2 className="flex items-center gap-2 text-xl font-bold text-[#292335]">
        <FiMapPin className="text-[#75619A]" />
        Delivery Information
      </h2>

      <label className="mt-6 block text-sm font-semibold text-[#292335]">
        Full Name
      </label>

      <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#E7E0EF] px-4">
        <FiUser className="text-[#75619A]" />

        <input
          required
          maxLength={150}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter your full name"
          className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-[#292335] outline-none"
        />
      </div>

      <label className="mt-5 block text-sm font-semibold text-[#292335]">
        Phone Number
      </label>

      <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#E7E0EF] px-4">
        <FiPhone className="text-[#75619A]" />

        <input
          required
          type="tel"
          inputMode="numeric"
          maxLength={11}
          pattern="03[0-9]{9}"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 11))
          }
          placeholder="03001234567"
          className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-[#292335] outline-none"
        />
      </div>

      <label className="mt-5 block text-sm font-semibold text-[#292335]">
        Delivery Address
      </label>

      <textarea
        required
        maxLength={2000}
        rows={4}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your complete address"
        className="mt-2 w-full rounded-xl border border-[#E7E0EF] px-4 py-3.5 text-sm text-[#292335] outline-none focus:border-[#B8A4E3]"
      />

      <div className="mt-6 rounded-xl bg-[#EEE8F7] p-4">
        <p className="font-bold text-[#292335]">Payment Method</p>
        <p className="mt-1 text-sm text-[#655F6F]">
          Cash on Delivery (COD)
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {invalidStock && (
        <p className="mt-4 text-sm text-red-600">
          One or more products have insufficient stock.
        </p>
      )}

      <Button
        type="submit"
        disabled={submitting || invalidStock}
        className="mt-6 h-auto w-full rounded-xl bg-[#B8A4E3] px-5 py-4 font-bold text-[#292335] hover:bg-[#A58ED8] disabled:opacity-50"
      >
        {submitting
          ? "Placing Order..."
          : `Confirm Order — Rs. ${total.toLocaleString("en-PK")}`}
      </Button>
    </form>
  );
}



"use client";

import { Button } from "@/components/ui/button";

type CheckoutButtonProps = {
  submitting: boolean;
  disabled?: boolean;
  total: number;
};

export default function CheckoutButton({
  submitting,
  disabled = false,
  total,
}: CheckoutButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || submitting}
      className="mt-6 h-auto w-full rounded-xl bg-[#B8A4E3] px-5 py-4 font-bold text-[#292335] transition hover:bg-[#A58ED8] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {submitting
        ? "Placing Order..."
        : `Confirm Order — Rs. ${total.toLocaleString("en-PK")}`}
    </Button>
  );
}

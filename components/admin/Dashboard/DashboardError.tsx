"use client";

import { FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";

type Props = {
  error: string;
  refreshing: boolean;
  onRetry: () => void;
};

export default function DashboardError({
  error,
  refreshing,
  onRetry,
}: Props) {
  if (!error) return null;

  return (
    <div
      role="alert"
      className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />

      <div>
        <p className="font-semibold">{error}</p>

        <p className="mt-1">
          Check your admin login and dashboard API if this continues.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          disabled={refreshing}
          className="mt-3 border-red-200 bg-white"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
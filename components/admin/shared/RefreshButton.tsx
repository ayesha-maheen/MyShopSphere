"use client";

import { FiRefreshCw } from "react-icons/fi";

type RefreshButtonProps = {
  onClick: () => void;
  loading?: boolean;
  label?: string;
};

export default function RefreshButton({
  onClick,
  loading = false,
  label = "Refresh",
}: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-[#E7E0EF] bg-white px-4 py-3 text-sm font-semibold text-[#292335] transition hover:bg-[#EEE8F7] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FiRefreshCw className={loading ? "animate-spin" : ""} />
      {loading ? "Refreshing..." : label}
    </button>
  );
}
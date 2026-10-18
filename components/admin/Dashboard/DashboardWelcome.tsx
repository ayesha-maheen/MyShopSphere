"use client";

import { FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components/ui/button";

type Props = {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

export default function DashboardWelcome({
  loading,
  refreshing,
  onRefresh,
}: Props) {
  return (
    <section className="rounded-3xl bg-[#EEE8F7] p-7 sm:p-10">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#65528A]">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome to Admin dashboard
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#655F6F] sm:text-base">
            Manage your MyShopSphere store, track orders and monitor your
            store activity from one place.
          </p>
        </div>

        <Button
          type="button"
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="w-fit rounded-xl bg-[#65528A] text-white hover:bg-[#51416F]"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>
    </section>
  );
}
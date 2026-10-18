"use client";

import { useAdminDashboard } from "@/components/hooks/useAdminDashboard";

import DashboardHeader from "@/components/admin/Dashboard/DashboardHeader";
import DashboardWelcome from "@/components/admin/Dashboard/DashboardWelcome";
import DashboardError from "@/components/admin/Dashboard/DashboardError";
import DashboardQuickStart from "@/components/admin/Dashboard/DashboardQuickStart";
import DashboardFooter from "@/components/admin/Dashboard/DashboardFooter";

import DashboardStats from "@/components/admin/Dashboard/DashboardStats";
import DashboardOrders from "@/components/admin/Dashboard/DashboardOrders";
import DashboardOverview from "@/components/admin/Dashboard/DashboardOverview";

export default function AdminDashboardPage() {
  const {
    stats,
    recentOrders,
    loading,
    refreshing,
    error,
    loadDashboard,
  } = useAdminDashboard();

  const refresh = () => {
    void loadDashboard();
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#292335]">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <DashboardWelcome
          loading={loading}
          refreshing={refreshing}
          onRefresh={refresh}
        />

        <DashboardError
          error={error}
          refreshing={refreshing}
          onRetry={refresh}
        />

        <DashboardStats stats={stats} loading={loading} />

        <DashboardOverview stats={stats} loading={loading} />

        <DashboardOrders orders={recentOrders} loading={loading} />

        <DashboardQuickStart />

        <DashboardFooter />
      </div>
    </main>
  );
}
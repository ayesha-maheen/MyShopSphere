
"use client";

import { FiShoppingCart, FiPackage } from "react-icons/fi";

import AdminHeader from "@/components/admin/shared/AdminHeader";
import PageHeading from "@/components/admin/shared/PageHeading";
import StatCard from "@/components/admin/shared/StatCard";
import AdminMessage from "@/components/admin/shared/AdminMessage";
import RefreshButton from "@/components/admin/shared/RefreshButton";
import OrderCard from "@/components/admin/orders/OrderCard";

import { useAdminOrders } from "@/components/hooks/useAdminOrders";

export default function AdminOrdersPage() {
  const {
    orders,
    loading,
    error,
    notice,
    updatingId,
    refreshOrders,
    updateStatus,
  } = useAdminOrders();

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#292335]">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <PageHeading
            title="Customer Orders"
            description="View orders and manage their delivery status."
          />

          <RefreshButton onClick={refreshOrders} loading={loading} />
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={<FiShoppingCart className="text-xl" />}
          />

          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={<FiPackage className="text-xl" />}
            iconClassName="bg-amber-100 text-amber-700"
          />
        </div>

        {error && (
          <>
            <AdminMessage message={error} type="error" />

            {(error.toLowerCase().includes("unauthorized") ||
              error.includes("401")) && (
              <p className="mt-2 text-sm text-red-700">
                Admin login karein, phir page refresh karein.
              </p>
            )}
          </>
        )}

        {notice && (
          <AdminMessage message={notice} type="success" />
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-[#E7E0EF] bg-white p-10 text-center text-[#75619A]">
            Loading orders...
          </div>
        ) : error && orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#E7E0EF] bg-white p-10 text-center text-sm text-[#827A8D]">
            Orders load nahi ho sake. Error message check karein.
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#E7E0EF] bg-white p-12 text-center">
            <FiShoppingCart className="mx-auto text-4xl text-[#B8A4E3]" />

            <h2 className="mt-4 text-xl font-bold">
              No Orders Yet
            </h2>

            <p className="mt-2 text-sm text-[#827A8D]">
              Customer orders yahan show honge jab koi order place karega.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                updating={updatingId === order.id}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-[#827A8D]">
          MyShopSphere Admin Panel
        </footer>
      </div>
    </main>
  );
}

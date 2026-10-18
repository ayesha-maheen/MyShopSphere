
"use client";

import { useCallback, useEffect, useState } from "react";
import { FiShoppingCart, FiPackage } from "react-icons/fi";

import AdminHeader from "@/components/admin/shared/AdminHeader";
import PageHeading from "@/components/admin/shared/PageHeading";
import StatCard from "@/components/admin/shared/StatCard";
import AdminMessage from "@/components/admin/shared/AdminMessage";
import RefreshButton from "@/components/admin/shared/RefreshButton";
import OrderCard from  "@/components/admin/orders/OrderCard";

import type { Order } from "@/components/admin/orders/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(
      `Invalid API response. Status: ${response.status}`,
    );
  }
}

function getError(data: unknown): string | undefined {
  return isRecord(data) && typeof data.error === "string"
    ? data.error
    : undefined;
}

function getOrders(data: unknown): Order[] | null {
  if (Array.isArray(data)) return data as Order[];

  if (isRecord(data) && Array.isArray(data.orders)) {
    return data.orders as Order[];
  }

  return null;
}

function getUpdatedStatus(data: unknown): string | null {
  if (!isRecord(data)) return null;

  const result = isRecord(data.order) ? data.order : data;

  return typeof result.status === "string" ? result.status : null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
        signal,
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          getError(data) ?? `Orders load nahi huay: ${response.status}`,
        );
      }

      const result = getOrders(data);

      if (!result) {
        throw new Error("API response mein orders ki list nahi mili.");
      }

      setOrders(result);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setError(
        err instanceof Error ? err.message : "Orders load nahi huay.",
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadOrders(controller.signal);

    return () => controller.abort();
  }, [loadOrders]);

  const refreshOrders = useCallback(() => {
    setNotice("");
    void loadOrders();
  }, [loadOrders]);

  async function updateStatus(orderId: number, status: string) {
    try {
      setUpdatingId(orderId);
      setError("");
      setNotice("");

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          getError(data) ?? `Status update nahi hua: ${response.status}`,
        );
      }

      const updatedStatus = getUpdatedStatus(data);

      if (!updatedStatus) {
        throw new Error("API ne updated order status return nahi kiya.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? { ...order, status: updatedStatus }
            : order,
        ),
      );

      setNotice(`Order #${orderId} ka status update ho gaya.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status update nahi hua.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

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

        {notice && <AdminMessage message={notice} type="success" />}

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

            <h2 className="mt-4 text-xl font-bold">No Orders Yet</h2>

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

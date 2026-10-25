
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order } from "@/components/admin/orders/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`Invalid API response. Status: ${response.status}`);
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

export function useAdminOrders() {
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

    const timer = window.setTimeout(() => {
      void loadOrders(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadOrders]);
  
  const refreshOrders = useCallback(() => {
  setNotice("");
  setLoading(true);
  setError("");
  void loadOrders();
}, [loadOrders]);

  const updateStatus = useCallback(
    async (orderId: number, status: string) => {
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
    },
    [],
  );

  return {
    orders,
    loading,
    error,
    notice,
    updatingId,
    refreshOrders,
    updateStatus,
  };
}

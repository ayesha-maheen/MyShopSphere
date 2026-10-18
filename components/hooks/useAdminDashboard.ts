
"use client";

import { useCallback, useEffect, useState } from "react";

export type DashboardStatsData = {
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  totalSales: number;
};

export type RecentOrderData = {
  id: number;
  customerName: string;
  total: number | string;
  status: string;
  createdAt: string;
  orderitem: {
    id: number;
    quantity: number;
    product: {
      name: string;
    } | null;
  }[];
};

type DashboardResponse = {
  stats: DashboardStatsData;
  recentOrders: RecentOrderData[];
};

// Share only an in-progress request.
// A new request can be made after the previous one finishes.
let dashboardRequest: Promise<DashboardResponse> | null = null;

function requestDashboardData(): Promise<DashboardResponse> {
  if (!dashboardRequest) {
    const request = (async () => {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Admin login required. Please log in again."
          );
        }

        throw new Error("Dashboard data could not be loaded.");
      }

      return (await response.json()) as DashboardResponse;
    })();

    dashboardRequest = request;

    void request.then(
      () => {
        if (dashboardRequest === request) {
          dashboardRequest = null;
        }
      },
      () => {
        if (dashboardRequest === request) {
          dashboardRequest = null;
        }
      }
    );
  }

  return dashboardRequest;
}

const initialStats: DashboardStatsData = {
  totalProducts: 0,
  totalCategories: 0,
  totalCustomers: 0,
  totalOrders: 0,
  pendingOrders: 0,
  confirmedOrders: 0,
  totalSales: 0,
};

export function useAdminDashboard() {
  const [stats, setStats] =
    useState<DashboardStatsData>(initialStats);

  const [recentOrders, setRecentOrders] =
    useState<RecentOrderData[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    return requestDashboardData();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        setError("");

        const data = await fetchDashboard();

        if (active) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders ?? []);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [fetchDashboard]);

  const loadDashboard = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      const data = await fetchDashboard();

      setStats(data.stats);
      setRecentOrders(data.recentOrders ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setRefreshing(false);
    }
  }, [fetchDashboard]);

  return {
    stats,
    recentOrders,
    loading,
    refreshing,
    error,
    loadDashboard,
  };
}

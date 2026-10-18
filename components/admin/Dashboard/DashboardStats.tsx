"use client";

import Link from "next/link";

import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";

import StatCard from "@/components/admin/shared/StatCard";

import type { DashboardStatsData } from "@/components/hooks/useAdminDashboard";
import type { ReactNode } from "react";

type DashboardStatsProps = {
  stats: DashboardStatsData;
  loading: boolean;
};

type StatItem = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  stat: keyof DashboardStatsData;
};

function StatSkeleton() {
  return (
    <div
      className="min-h-[150px] animate-pulse rounded-2xl border border-[#E9E2F1] bg-white p-5 shadow-sm"
      aria-label="Loading statistic"
      role="status"
    >
      <div className="flex items-start justify-between">
        <div className="h-4 w-28 rounded-md bg-[#EDE7F5]" />
        <div className="h-11 w-11 rounded-xl bg-[#EDE7F5]" />
      </div>

      <div className="mt-5 h-8 w-20 rounded-md bg-[#E5D9F2]" />

      <div className="mt-3 h-3 w-40 max-w-full rounded-md bg-[#F0ECF5]" />
    </div>
  );
}

export default function DashboardStats({
  stats,
  loading,
}: DashboardStatsProps) {
  const cards: StatItem[] = [
    {
      title: "Total Products",
      description: "Add, edit and organize products",
      href: "/admin/products",
      icon: <ShoppingBagOutlined sx={{ fontSize: 27 }} />,
      stat: "totalProducts",
    },
    {
      title: "Total Orders",
      description: "View and manage customer orders",
      href: "/admin/orders",
      icon: <ShoppingCartOutlined sx={{ fontSize: 27 }} />,
      stat: "totalOrders",
    },
    {
      title: "Categories",
      description: "Organize your store categories",
      href: "/admin/categories",
      icon: <CategoryOutlined sx={{ fontSize: 27 }} />,
      stat: "totalCategories",
    },
    {
      title: "Customers",
      description: "View registered customers",
      href: "/admin/customers",
      icon: <PeopleAltOutlined sx={{ fontSize: 27 }} />,
      stat: "totalCustomers",
    },
  ];

  return (
    <section className="mt-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Store Overview</h2>
        <p className="mt-1 text-sm text-[#827A8D]">
          Your store statistics from the database.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? cards.map((item) => <StatSkeleton key={item.title} />)
          : cards.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#65528A]"
              >
                <StatCard
                  title={item.title}
                  value={stats[item.stat]}
                  icon={item.icon}
                  description={item.description}
                />
              </Link>
            ))}
      </div>
    </section>
  );
}
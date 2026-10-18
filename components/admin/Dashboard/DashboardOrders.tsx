"use client";

import Link from "next/link";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminTable from "@/components/admin/shared/AdminTable";

import type { AdminTableColumn } from "@/components/admin/shared/AdminTable";
import type { RecentOrderData } from "@/components/hooks/useAdminDashboard";

type DashboardOrdersProps = {
  orders: RecentOrderData[];
  loading: boolean;
};

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return "border-[#D7EBDD] bg-[#EAF6EE] text-[#28643C]";
    case "PENDING":
      return "border-[#F1E2BC] bg-[#FFF7E5] text-[#8A651B]";
    case "CANCELLED":
      return "border-[#F0D5D5] bg-[#FFF0F0] text-[#A33A3A]";
    case "DELIVERED":
      return "border-[#D7E6F5] bg-[#EEF6FF] text-[#315D8A]";
    default:
      return "border-[#E7E0EF] bg-[#F5F1FA] text-[#65528A]";
  }
}

const columns: AdminTableColumn<RecentOrderData>[] = [
  {
    key: "id",
    title: "Order ID",
    render: (order) => (
      <span className="font-bold">#{order.id}</span>
    ),
  },
  {
    key: "customer",
    title: "Customer",
    render: (order) => order.customerName || "Guest",
  },
  {
    key: "products",
    title: "Products",
    render: (order) =>
      order.orderitem
        .map(
          (item) =>
            `${item.product?.name ?? "Product"} × ${item.quantity}`
        )
        .join(", "),
  },
  {
    key: "total",
    title: "Total",
    className: "whitespace-nowrap",
    render: (order) => (
      <span className="font-semibold">
        {formatCurrency(order.total)}
      </span>
    ),
  },
  {
    key: "status",
    title: "Status",
    render: (order) => (
      <Badge
        variant="outline"
        className={getStatusStyle(order.status)}
      >
        {order.status}
      </Badge>
    ),
  },
  {
    key: "date",
    title: "Date",
    className: "whitespace-nowrap text-[#827A8D]",
    render: (order) => formatDate(order.createdAt),
  },
];

export default function DashboardOrders({
  orders,
  loading,
}: DashboardOrdersProps) {
  return (
    <section className="mt-10">
      <Card className="overflow-hidden rounded-2xl border-[#E7E0EF] bg-white">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl">Recent Orders</CardTitle>
            <p className="mt-2 text-sm font-normal text-[#827A8D]">
              The five most recent orders in your store.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="shrink-0 text-sm font-bold text-[#65528A] hover:underline"
          >
            View All
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <AdminTable
            columns={columns}
            data={orders}
            getRowKey={(order) => order.id}
            loading={loading}
            loadingText="Loading recent orders..."
            emptyTitle="No orders yet"
            emptyDescription="New customer orders will appear here."
            emptyIcon={
              <ShoppingCartOutlined sx={{ fontSize: 38 }} />
            }
            minWidth="900px"
          />
        </CardContent>
      </Card>
    </section>
  );
}
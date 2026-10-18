
import OrderCustomerDetails from "./OrderCustomerDetails";
import OrderProducts from "./OrderProducts";
import OrderStatusSelect from "./OrderStatusSelect";
import type { Order } from "./types";

type Props = {
  order: Order;
  updating: boolean;
  onStatusChange: (orderId: number, status: string) => void;
};

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusStyle(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "SHIPPED":
      return "bg-violet-100 text-violet-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export default function OrderCard({
  order,
  updating,
  onStatusChange,
}: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E7E0EF] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E0EF] bg-[#EEE8F7]/50 p-5 sm:px-6">
        <div>
          <h2 className="text-lg font-extrabold">
            Order #{order.id}
          </h2>

          <p className="mt-1 text-xs text-[#827A8D]">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(order.status)}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
        <OrderCustomerDetails order={order} />

        <div>
          <OrderProducts items={order.orderitem ?? []} />

          <OrderStatusSelect
            orderId={order.id}
            status={order.status}
            updating={updating}
            onChange={(status) => onStatusChange(order.id, status)}
          />
        </div>
      </div>
    </article>
  );
}

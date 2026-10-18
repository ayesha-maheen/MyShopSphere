
import {
  FiUser,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

import type { Order } from "./types";

type Props = {
  order: Order;
};

function formatPrice(value: number | string): string {
  return Number(value).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  });
}

export default function OrderCustomerDetails({ order }: Props) {
  return (
    <div>
      <h3 className="mb-4 font-bold">Customer Details</h3>

      <div className="space-y-3 text-sm">
        <p className="flex items-start gap-3">
          <FiUser className="mt-0.5 shrink-0 text-[#75619A]" />
          <span>{order.customerName || "Not provided"}</span>
        </p>

        <p className="flex items-start gap-3">
          <FiPhone className="mt-0.5 shrink-0 text-[#75619A]" />
          <span>{order.phone || "Not provided"}</span>
        </p>

        <p className="flex items-start gap-3">
          <FiMapPin className="mt-0.5 shrink-0 text-[#75619A]" />
          <span className="break-words">
            {order.address || "Not provided"}
          </span>
        </p>
      </div>

      <div className="mt-5 rounded-xl bg-[#F9F7F2] p-4">
        <p className="text-xs text-[#827A8D]">Payment Method</p>

        <p className="mt-1 font-semibold">
          {order.paymentMethod === "COD"
            ? "Cash on Delivery"
            : order.paymentMethod}
        </p>

        <p className="mt-4 text-xs text-[#827A8D]">Order Total</p>

        <p className="mt-1 text-xl font-black text-[#75619A]">
          Rs. {formatPrice(order.total)}
        </p>
      </div>
    </div>
  );
}

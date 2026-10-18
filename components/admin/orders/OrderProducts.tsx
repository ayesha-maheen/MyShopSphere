
import { FiPackage } from "react-icons/fi";

import type { OrderItem } from "./types";

type Props = {
  items: OrderItem[];
};

function formatPrice(value: number | string): string {
  return Number(value).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  });
}

export default function OrderProducts({ items }: Props) {
  return (
    <div>
      <h3 className="mb-4 font-bold">Products Ordered</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-[#E7E0EF] p-3"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EEE8F7]">
              {item.product?.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <FiPackage className="text-xl text-[#75619A]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-bold">
                {item.product?.name ?? "Product unavailable"}
              </p>

              <p className="mt-1 text-xs text-[#827A8D]">
                Quantity: {item.quantity}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#75619A]">
                Rs. {formatPrice(item.price)} each
              </p>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-[#827A8D]">
            No product details available.
          </p>
        )}
      </div>
    </div>
  );
}

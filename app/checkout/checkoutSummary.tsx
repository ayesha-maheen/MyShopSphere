
import { FiShoppingBag } from "react-icons/fi";

type Product = {
  id: number;
  name: string;
  price: number | string;
  image: string | null;
  stock: number;
  category?: { name: string } | null;
};

type CheckoutItem = {
  product: Product;
  quantity: number;
};

type Props = {
  items: CheckoutItem[];
  total: number;
  totalQuantity: number;
};

export default function CheckoutSummary({
  items,
  total,
  totalQuantity,
}: Props) {
  return (
    <aside className="h-fit rounded-3xl border border-[#E7E0EF] bg-white p-5 sm:p-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-[#292335]">
        <FiShoppingBag className="text-[#75619A]" />
        Order Summary
      </h2>

      <div className="mt-6 divide-y divide-[#E7E0EF]">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex gap-4 py-5 first:pt-0"
          >
            <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EEE8F7]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <FiShoppingBag className="text-2xl text-[#75619A]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[#292335]">
                {product.name}
              </h3>

              {product.category?.name && (
                <p className="mt-1 text-xs text-[#75619A]">
                  {product.category.name}
                </p>
              )}

              <p className="mt-2 text-sm text-[#655F6F]">
                Rs. {Number(product.price).toLocaleString("en-PK")} ×{" "}
                {quantity}
              </p>

              <p className="mt-2 font-bold text-[#75619A]">
                Rs.{" "}
                {(Number(product.price) * quantity).toLocaleString("en-PK")}
              </p>

              {quantity > product.stock && (
                <p className="mt-1 text-xs text-red-600">
                  Available stock: {product.stock}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-4 border-t border-[#E7E0EF] pt-5">
        <div className="flex justify-between text-sm">
          <span className="text-[#655F6F]">Total Items</span>
          <span className="font-medium text-[#292335]">
            {totalQuantity}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#655F6F]">Payment</span>
          <span className="font-medium text-[#292335]">
            Cash on Delivery
          </span>
        </div>

        <div className="flex justify-between border-t border-[#E7E0EF] pt-5">
          <span className="font-bold text-[#292335]">
            Product Total
          </span>

          <span className="text-xl font-black text-[#75619A]">
            Rs. {total.toLocaleString("en-PK")}
          </span>
        </div>
      </div>
    </aside>
  );
}

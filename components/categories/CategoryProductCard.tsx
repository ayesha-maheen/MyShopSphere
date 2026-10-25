
import Link from "next/link";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";

import type { CategoryProduct } from "@/components/hooks/useCategoryProducts";
import { formatPrice } from "@/components/categories/CategoryUtils";

export default function CategoryProductCard({
  product,
}: {
  product: CategoryProduct;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group overflow-hidden rounded-2xl border border-[#E7E0EF] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#F1ECF8]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <FiShoppingBag className="text-4xl text-[#B8A4E3]" />
        )}
      </div>

      <div className="p-4">
        <h2 className="line-clamp-1 font-semibold text-[#292335]">
          {product.name}
        </h2>

        <p className="mt-2 font-bold text-[#75619A]">
          Rs. {formatPrice(product.price)}
        </p>

        <span className="mt-3 inline-flex items-center gap-2 text-sm text-[#75619A]">
          View Product
          <FiArrowRight />
        </span>
      </div>
    </Link>
  );
}

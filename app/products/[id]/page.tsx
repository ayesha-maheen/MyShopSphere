"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { useProductDetails } from "@/components/hooks/useProductDetails";

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const productId = params?.id;

  const { product, loading, error } = useProductDetails(
    typeof productId === "string" ? productId : undefined
  );

  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid animate-pulse gap-5 rounded-2xl border border-[#E7E0EF] bg-white p-4 md:grid-cols-2">
          <div className="min-h-[280px] rounded-xl bg-[#EEE8F7]" />
          <div className="space-y-4 py-3">
            <div className="h-5 w-1/3 rounded bg-[#EEE8F7]" />
            <div className="h-8 w-3/4 rounded bg-[#EEE8F7]" />
            <div className="h-5 w-1/2 rounded bg-[#EEE8F7]" />
            <div className="h-20 rounded bg-[#EEE8F7]" />
            <div className="h-11 rounded bg-[#EEE8F7]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-12 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[#292335]">
          Product not found
        </h1>

        <p className="mt-2 text-sm text-[#75619A]">
          This product may no longer be available.
        </p>

        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#75619A] px-5 py-3 font-semibold text-white hover:bg-[#655184]"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </main>
    );
  }

  const stock = Math.max(0, Number(product.stock ?? 0));
  const price = Number(product.price ?? 0);
  const imageSrc = product.image || "/products/placeholder.png";
  
function handleAddToCart() {
  if (!product || stock < 1 || quantity > stock) return;

  const cartProduct = {
    id: Number(product.id),
    name: product.name,
    price: Number(product.price),
    image: product.image || "",
  };

  for (let i = 0; i < quantity; i++) {
    addToCart(cartProduct);
  }
}

function handleBuyNow() {
  if (!product || stock < 1 || quantity > stock) return;

  router.push(
    `/checkout?productId=${product.id}&quantity=${quantity}`
  );
}
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/products"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#75619A] hover:text-[#292335]"
      >
        <ArrowLeft size={17} />
        Back to Products
      </Link>

      <section className="grid gap-5 rounded-2xl border border-[#E7E0EF] bg-white p-4 shadow-sm sm:p-5 md:grid-cols-2">
        <div className="flex min-h-[260px] items-center justify-center rounded-xl bg-[#EEE8F7] p-4 sm:min-h-[330px]">
          <div className="relative h-[250px] w-full sm:h-[310px]">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col justify-center py-1">
          {product.category?.name && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#75619A]">
              {product.category.name}
            </p>
          )}

          <h1 className="text-2xl font-bold leading-tight text-[#292335] sm:text-3xl">
            {product.name}
          </h1>

          <p className="mt-3 text-2xl font-bold text-[#75619A]">
            Rs. {price.toLocaleString("en-PK")}
          </p>

          <div className="my-4 h-px bg-[#E7E0EF]" />

          <h2 className="text-sm font-semibold text-[#292335]">
            Product Description
          </h2>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#655F6F]">
            {product.description ||
              "No description available for this product."}
          </p>

          <p
            className={`mt-4 text-sm font-medium ${
              stock > 0 ? "text-[#75619A]" : "text-red-600"
            }`}
          >
            {stock > 0 ? `${stock} items available` : "Out of stock"}
          </p>

          {stock > 0 && (
            <>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm font-semibold text-[#292335]">
                  Quantity
                </span>

                <div className="flex items-center rounded-lg border border-[#E7E0EF]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    className="p-2.5 text-[#75619A] hover:bg-[#EEE8F7] disabled:opacity-40"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="min-w-10 text-center text-sm font-semibold text-[#292335]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= stock}
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(stock, current + 1)
                      )
                    }
                    className="p-2.5 text-[#75619A] hover:bg-[#EEE8F7] disabled:opacity-40"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm font-bold text-[#292335]">
                Total: Rs. {(price * quantity).toLocaleString("en-PK")}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#B8A4E3] px-3 py-2.5 text-sm font-semibold text-[#75619A] transition hover:bg-[#EEE8F7]"
                >
                  <ShoppingCart size={17} />
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="min-h-11 rounded-xl bg-[#75619A] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#655184]"
                >
                  Buy Now
                </button>
              </div>
            </>
          )}

          <div className="mt-6 grid gap-3 border-t border-[#E7E0EF] pt-4">
            <div className="flex items-center gap-3">
              <Truck size={18} className="shrink-0 text-[#75619A]" />
              <span className="text-xs text-[#655F6F]">
                Convenient delivery to your doorstep
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="shrink-0 text-[#75619A]" />
              <span className="text-xs text-[#655F6F]">
                Shop with confidence
              </span>
            </div>

            <div className="flex items-center gap-3">
              <RotateCcw size={18} className="shrink-0 text-[#75619A]" />
              <span className="text-xs text-[#655F6F]">
                Contact support for order assistance
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductDetailsPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />

      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
            <div className="h-80 animate-pulse rounded-2xl bg-[#EEE8F7]" />
          </div>
        }
      >
        <ProductDetailsContent />
      </Suspense>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiPackage } from "react-icons/fi";

import ProductCard from "./ProductCard";

type Product = {
  id: number;
  name: string;
  price: number | string;
  image: string | null;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

       if (!response.ok) {
  const errorData = await response.json();

  console.error("Products API Error Details:", errorData);

  throw new Error(
    errorData.details || `Products API failed: ${response.status}`
  );
}

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid products response");
        }

        setProducts(data as Product[]);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Products fetch error:", error);
        setProducts([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchProducts();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-[#faf8fc] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-[#E7E0EF] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#75619A]">
              Curated For You
            </span>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#292335] sm:text-4xl lg:text-5xl">
              Trending Products
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-7 text-[#655F6F] sm:text-base">
              Discover everyday favorites and find something special for you.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#E7E0EF] bg-white px-5 py-3 text-sm font-semibold text-[#75619A] transition hover:border-[#B8A4E3] hover:bg-[#EEE8F7]"
          >
            View All Products
            <FiArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading ? (
          <div className="mt-7 flex gap-4 overflow-x-auto pb-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-[200px] shrink-0 animate-pulse rounded-2xl border border-[#E7E0EF] bg-white p-3 sm:w-[230px]"
              >
                <div className="aspect-[4/5] rounded-xl bg-[#EEE8F7]" />
                <div className="mt-4 h-4 w-3/4 rounded bg-[#E7E0EF]" />
                <div className="mt-3 h-4 w-1/3 rounded bg-[#E7E0EF]" />
                <div className="mt-4 h-10 rounded-xl bg-[#EEE8F7]" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-7 rounded-3xl border border-dashed border-[#B8A4E3] bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE8F7] text-[#75619A]">
              <FiPackage size={26} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-[#292335]">
              Products Coming Soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#655F6F]">
              Once products are added to your database, they will appear here.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#75619A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#655080]"
            >
              Explore Products
              <FiArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-7 flex gap-4 overflow-x-auto pb-4 sm:gap-5">
            {products.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="w-[200px] shrink-0 sm:w-[230px]"
              >
                <ProductCard
                  id={String(product.id)}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.image || "/products/placeholder.png"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

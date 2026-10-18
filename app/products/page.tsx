"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiPackage } from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  price: number | string;
  image: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Products load nahi ho sake.");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Products data valid nahi hai.");
        }

        setProducts(data as Product[]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
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
    <>
      <Navbar />

      <main className="min-h-[70vh] w-full bg-[#F9F7F2] py-8 sm:py-10">
        {/* Same content width and horizontal padding as Navbar */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#75619A] transition hover:text-[#292335]"
          >
            <FiArrowLeft size={17} />
            Back to Home
          </Link>

          <section className="mb-8 rounded-2xl border border-[#E7E0EF] bg-white p-5 shadow-sm sm:p-7">
            <span className="inline-flex rounded-full border border-[#E7E0EF] bg-[#F9F7F2] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#75619A]">
              Explore Our Collection
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#292335] sm:text-4xl">
              All Products
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#655F6F] sm:text-base">
              Discover your favorites, from everyday essentials to
              stylish accessories, electronics, and lifestyle products.
            </p>

            {!loading && !error && (
              <p className="mt-4 text-sm font-semibold text-[#75619A]">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} available
              </p>
            )}
          </section>

          {loading ? (
            <div
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
              aria-label="Loading products"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-[#E7E0EF] bg-white p-3"
                >
                  <div className="aspect-[4/5] rounded-xl bg-[#EEE8F7]" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-[#E7E0EF]" />
                  <div className="mt-3 h-4 w-1/3 rounded bg-[#E7E0EF]" />
                  <div className="mt-4 h-10 rounded-xl bg-[#EEE8F7]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#E7E0EF] bg-white px-5 py-12 text-center">
              <FiPackage
                size={36}
                className="mx-auto text-[#75619A]"
              />

              <h2 className="mt-4 text-xl font-bold text-[#292335]">
                Unable to Load Products
              </h2>

              <p className="mt-2 text-sm text-[#655F6F]">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-[#B8A4E3] px-5 py-3 text-sm font-semibold text-[#292335] transition hover:bg-[#A58ED8]"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#B8A4E3] bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEE8F7] text-[#75619A]">
                <FiPackage size={30} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#292335]">
                No Products Yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#655F6F]">
                Products will appear here once you add them to your store.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#B8A4E3] px-5 py-3 text-sm font-semibold text-[#292335] transition hover:bg-[#A58ED8]"
              >
                <FiArrowLeft size={16} />
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={String(product.id)}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.image || "/products/placeholder.png"}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
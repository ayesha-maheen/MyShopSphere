
"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiSliders,
  FiShoppingBag,
} from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import CategoryProductCard from "@/components/categories/CategoryProductCard";
import CategoryLoading from "@/components/categories/CategoryLoading";
import { useCategoryPage } from "@/components/hooks/useCategoryPage";

import {
  getDisplayName,
  normalize,
  type SortOption,
} from "@/components/categories/CategoryUtils";

function CategoryContent() {
  const params = useParams<{ slug: string[] }>();
  const slugs = Array.isArray(params.slug) ? params.slug : [params.slug];

  const {
    products,
    loading,
    error,
    search,
    setSearch,
    sort,
    setSort,
    categoryState,
    rootSlug,
    rootCategory,
    title,
    subcategories,
  } = useCategoryPage(slugs);

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-[#F9F7F2] py-8 text-[#292335] sm:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl bg-gradient-to-br from-[#EEE8F7] via-[#E6E0F5] to-[#F1ECF8] px-6 py-10 sm:px-10 sm:py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#75619A]">
              MyShopSphere Collection
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
              {title}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#655F6F] sm:text-base">
              Explore our collection and find products that suit your style.
            </p>
          </section>

          {slugs.length === 1 && (
            <section className="mt-8">
              <h2 className="mb-4 text-xl font-bold">
                Shop by Category
              </h2>

              {categoryState.loading ? (
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-10 w-28 animate-pulse rounded-full bg-[#E6E0F5]"
                    />
                  ))}
                </div>
              ) : subcategories.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {subcategories.map((subcategory) => {
                    const displayName = getDisplayName({
                      ...subcategory,
                      parent: rootCategory
                        ? {
                            id: rootCategory.id,
                            name: rootCategory.name,
                            parentId: rootCategory.parentId,
                          }
                        : null,
                      subcategories: [],
                    });

                    return (
                      <Link
                        key={subcategory.id}
                        href={`/categories/${rootSlug}/${normalize(displayName)}`}
                        className="rounded-full border border-[#E7E0EF] bg-white px-5 py-2.5 text-sm font-medium text-[#655F6F] transition hover:border-[#B8A4E3] hover:bg-[#EEE8F7] hover:text-[#75619A]"
                      >
                        {displayName}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#655F6F]">
                  {categoryState.error || "No subcategories available."}
                </p>
              )}
            </section>
          )}

          <section className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {title} Products
                </h2>

                {!loading && (
                  <p className="mt-1 text-sm text-[#655F6F]">
                    {products.length} products found
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75619A]" />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products..."
                    aria-label="Search products"
                    className="w-full rounded-xl border border-[#E7E0EF] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B8A4E3] sm:w-64"
                  />
                </div>

                <div className="relative">
                  <FiSliders className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#75619A]" />

                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as SortOption)
                    }
                    aria-label="Sort products"
                    className="w-full appearance-none rounded-xl border border-[#E7E0EF] bg-white py-3 pl-10 pr-8 text-sm outline-none focus:border-[#B8A4E3] sm:w-52"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-2xl border border-[#E7E0EF] bg-white"
                  >
                    <div className="aspect-[4/3] bg-[#EEE8F7]" />

                    <div className="space-y-3 p-4">
                      <div className="h-4 rounded bg-[#EEE8F7]" />
                      <div className="h-4 w-2/3 rounded bg-[#E6E0F5]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="mt-6 rounded-xl border border-[#E7E0EF] bg-white p-5 text-sm text-red-700">
                {error}
              </div>
            ) : products.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <CategoryProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-[#E7E0EF] bg-white px-5 py-14 text-center">
                <FiShoppingBag className="mx-auto text-4xl text-[#B8A4E3]" />

                <h3 className="mt-4 text-lg font-semibold">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-[#655F6F]">
                  {search
                    ? "Try another search or clear your search."
                    : "There are currently no products in this category."}
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-4 rounded-xl bg-[#75619A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#655181]"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent />
    </Suspense>
  );
}

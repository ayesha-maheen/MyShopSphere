"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiSliders,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  useCategoryProducts,
  type CategoryProduct,
} from "@/components/hooks/useCategoryProducts";

type Category = {
  id: number;
  name: string;
  parentId: number | null;
  parent: {
    id: number;
    name: string;
    parentId: number | null;
  } | null;
  subcategories: {
    id: number;
    name: string;
    parentId: number | null;
  }[];
  _count?: {
    product: number;
    subcategories: number;
  };
};

type SortOption = "newest" | "price-low" | "price-high";

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDisplayName(category: Category) {
  const prefix = category.parent
    ? `${category.parent.name} - `
    : "";

  if (
    prefix &&
    category.name.toLowerCase().startsWith(prefix.toLowerCase())
  ) {
    return category.name.slice(prefix.length).trim();
  }

  return category.name;
}

function formatSlugTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPrice(price: number | string) {
  return Number(price).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  });
}

function ProductCard({ product }: { product: CategoryProduct }) {
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

function CategoryContent() {
  const params = useParams<{ slug: string[] }>();

  const slugs = Array.isArray(params.slug)
    ? params.slug
    : [params.slug];

  const { products, loading, error } = useCategoryProducts(slugs);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const [categoryState, setCategoryState] = useState<{
    categories: Category[];
    loading: boolean;
    error: string;
  }>({
    categories: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Categories could not be loaded.");
        }

        const result: unknown = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Invalid categories response.");
        }

        if (!cancelled) {
          setCategoryState({
            categories: result as Category[],
            loading: false,
            error: "",
          });
        }
      } catch (error) {
        if (
          cancelled ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return;
        }

        if (!cancelled) {
          setCategoryState({
            categories: [],
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "An error occurred while loading categories.",
          });
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const categories = categoryState.categories;
  const rootSlug = slugs[0] ?? "";

  const rootCategory = categories.find(
    (category) =>
      category.parentId === null &&
      normalize(category.name) === normalize(rootSlug)
  );

  const selectedCategory =
    slugs.length === 1
      ? rootCategory
      : categories.find((category) => {
          if (!category.parent) return false;

          return (
            normalize(category.parent.name) === normalize(rootSlug) &&
            normalize(getDisplayName(category)) === normalize(slugs[1] ?? "")
          );
        });

  const title = selectedCategory
    ? getDisplayName(selectedCategory)
    : formatSlugTitle(slugs[slugs.length - 1] ?? "");

  const subcategories = rootCategory?.subcategories ?? [];

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      return (
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
      );
    });
  }, [products, search, sort]);

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

                    const subcategorySlug = normalize(displayName);

                    return (
                      <Link
                        key={subcategory.id}
                        href={`/categories/${rootSlug}/${subcategorySlug}`}
                        className="rounded-full border border-[#E7E0EF] bg-white px-5 py-2.5 text-sm font-medium text-[#655F6F] transition hover:border-[#B8A4E3] hover:bg-[#EEE8F7] hover:text-[#75619A]"
                      >
                        {displayName}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#655F6F]">
                  {categoryState.error ||
                    "No subcategories available."}
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
                    {visibleProducts.length} products found
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
            ) : visibleProducts.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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

function CategoryLoading() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-[#F9F7F2] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl animate-pulse">
          <div className="h-48 rounded-3xl bg-[#EEE8F7]" />

          <div className="mt-8 h-8 w-48 rounded bg-[#E6E0F5]" />

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#E7E0EF] bg-white"
              >
                <div className="aspect-[4/3] bg-[#EEE8F7]" />

                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-[#EEE8F7]" />
                  <div className="h-4 w-2/3 rounded bg-[#E6E0F5]" />
                </div>
              </div>
            ))}
          </div>
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
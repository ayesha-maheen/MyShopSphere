"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiMenu,
  FiShoppingCart,
  FiUser,
  FiX,
  FiShoppingBag,
} from "react-icons/fi";

import { useCart } from "./CartProvider";

const categories = [
  {
    name: "Women",
    href: "/categories/women",
    subcategories: [
      { name: "All Women", href: "/categories/women" },
      { name: "Clothing", href: "/categories/women/clothing" },
      { name: "Shoes", href: "/categories/women/shoes" },
      { name: "Bags", href: "/categories/women/bags" },
      { name: "Accessories", href: "/categories/women/accessories" },
      { name: "Jewelry", href: "/categories/women/jewelry" },
    ],
  },
  {
    name: "Men",
    href: "/categories/men",
    subcategories: [
      { name: "All Men", href: "/categories/men" },
      { name: "Clothing", href: "/categories/men/clothing" },
      { name: "Shoes", href: "/categories/men/shoes" },
      { name: "Watches", href: "/categories/men/watches" },
      { name: "Bags", href: "/categories/men/bags" },
      { name: "Accessories", href: "/categories/men/accessories" },
    ],
  },
  {
    name: "Kids",
    href: "/categories/kids",
    subcategories: [
      { name: "All Kids", href: "/categories/kids" },
      { name: "Boys' Clothing", href: "/categories/kids/boys-clothing" },
      { name: "Girls' Clothing", href: "/categories/kids/girls-clothing" },
      { name: "Shoes", href: "/categories/kids/shoes" },
      { name: "Accessories", href: "/categories/kids/accessories" },
    ],
  },
  {
    name: "Electronics",
    href: "/categories/electronics",
    subcategories: [
      { name: "All Electronics", href: "/categories/electronics" },
      { name: "Headphones", href: "/categories/electronics/headphones" },
      { name: "Smart Watches", href: "/categories/electronics/smart-watches" },
      { name: "Speakers", href: "/categories/electronics/speakers" },
      {
        name: "Mobile Accessories",
        href: "/categories/electronics/mobile-accessories",
      },
    ],
  },
  {
    name: "Lifestyle",
    href: "/categories/lifestyle",
    subcategories: [
      { name: "All Lifestyle", href: "/categories/lifestyle" },
      { name: "Bags", href: "/categories/lifestyle/bags" },
      { name: "Accessories", href: "/categories/lifestyle/accessories" },
      { name: "Mugs", href: "/categories/lifestyle/mugs" },
      { name: "Stickers", href: "/categories/lifestyle/stickers" },
    ],
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const navbarRef = useRef<HTMLElement>(null);

  const { cartCount, openCart } = useCart();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setOpenCategory(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenCategory(null);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenCategory(null);
  };

  const toggleCategory = (name: string) => {
    setOpenCategory((current) => (current === name ? null : name));
  };

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 border-b border-[#E7E0EF] bg-[#F9F7F2]/95 shadow-[0_2px_12px_rgba(117,97,154,0.06)] backdrop-blur-md"
    >
      <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => {
              setIsMenuOpen((previous) => !previous);
              setOpenCategory(null);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#75619A] transition-colors hover:bg-[#E6E0F5] md:hidden"
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="MyShopSphere Home"
            className="flex shrink-0 items-center gap-2 sm:gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE8F7] text-[#75619A] transition-colors hover:bg-[#E6E0F5] sm:h-11 sm:w-11">
              <FiShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>

            <span className="text-lg font-black tracking-tight text-[#292335] sm:text-2xl">
              MyShop<span className="text-[#75619A]">Sphere</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 md:flex lg:gap-5">
          {categories.map((category) => {
            const isOpen = openCategory === category.name;

            return (
              <div key={category.name} className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleCategory(category.name)}
                  className={`flex items-center gap-1 rounded-lg px-2 py-3 text-sm font-semibold transition-colors ${
                    isOpen
                      ? "bg-[#E6E0F5] text-[#75619A]"
                      : "text-[#40384D] hover:bg-[#EEE8F7] hover:text-[#75619A]"
                  }`}
                >
                  {category.name}

                  <FiChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 min-w-56 overflow-hidden rounded-xl border border-[#E7E0EF] bg-[#FFFEFC] py-2 shadow-[0_12px_35px_rgba(74,56,105,0.14)]">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.href}
                        href={subcategory.href}
                        onClick={closeMenu}
                        className="block px-5 py-3 text-sm text-[#51485F] transition-colors hover:bg-[#EEE8F7] hover:text-[#75619A]"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Login and Cart */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Link
            href="/admin/login"
            aria-label="Admin Login"
            title="Admin Login"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#75619A] transition-colors hover:bg-[#E6E0F5]"
          >
            <FiUser className="h-5 w-5" />
          </Link>

          <button
            type="button"
            aria-label="Open shopping cart"
            onClick={() => {
              setOpenCategory(null);
              openCart();
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#75619A] transition-colors hover:bg-[#E6E0F5]"
          >
            <FiShoppingCart className="h-5 w-5" />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#75619A] px-1 text-[9px] font-bold leading-none text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay and Drawer */}
      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="fixed inset-x-0 bottom-0 top-20 z-40 bg-[#292335]/25 backdrop-blur-[2px] md:hidden"
          />

          <div className="absolute left-0 top-full z-50 max-h-[calc(100vh-5rem)] w-full overflow-y-auto border-t border-[#E7E0EF] bg-[#F9F7F2] shadow-[0_12px_30px_rgba(74,56,105,0.12)] md:hidden">
            <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              {categories.map((category) => {
                const isOpen = openCategory === category.name;

                return (
                  <div
                    key={category.name}
                    className="border-b border-[#E7E0EF]"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggleCategory(category.name)}
                        className={`flex flex-1 items-center justify-between rounded-lg py-4 pl-3 pr-2 text-left text-sm font-semibold transition-colors ${
                          isOpen
                            ? "text-[#75619A]"
                            : "text-[#40384D] hover:text-[#75619A]"
                        }`}
                      >
                        {category.name}

                        <FiChevronDown
                          className={`mr-2 h-4 w-4 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <Link
                        href={category.href}
                        onClick={closeMenu}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-[#75619A] hover:bg-[#E6E0F5]"
                      >
                        View All
                      </Link>
                    </div>

                    {isOpen && (
                      <div className="mb-3 ml-3 rounded-xl bg-[#EEE8F7] px-3 py-2">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.href}
                            href={subcategory.href}
                            onClick={closeMenu}
                            className="block rounded-lg px-3 py-3 text-sm text-[#51485F] transition-colors hover:bg-[#E6E0F5] hover:text-[#75619A]"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
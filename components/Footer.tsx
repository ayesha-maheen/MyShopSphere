
import Link from "next/link";
import {
  FiArrowUpRight,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-[#E7E0EF] bg-[#F9F7F2] text-[#292335]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-12 lg:px-8 lg:py-16">

        {/* Brand */}
        <div className="sm:col-span-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-black tracking-tight"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE8F7] text-[#75619A]">
              <FiShoppingBag className="h-5 w-5" />
            </span>
            <span>
              MyShop
              <span className="text-[#75619A]">Sphere</span>
            </span>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#716A7D]">
            Discover your favorite styles, explore fresh collections,
            and find something special for every part of your life.
            Enjoy a simple and comfortable shopping experience.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#75619A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#625080]"
          >
            Explore Products
            <FiArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#292335]">
            Quick Links
          </h3>

          <div className="mt-5 flex flex-col gap-4">
            {[
              { name: "Home", href: "/" },
              { name: "All Products", href: "/products" },
              { name: "Women", href: "/categories/women" },
              { name: "Men", href: "/categories/men" },
              { name: "Kids", href: "/categories/kids" },
              { name: "Electronics", href: "/categories/electronics" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="w-fit text-sm text-[#716A7D] transition hover:translate-x-1 hover:text-[#75619A]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#292335]">
            Customer Care
          </h3>

          <div className="mt-5 flex flex-col gap-4">
            <Link
              href="/admin/login"
              className="w-fit text-sm text-[#716A7D] transition hover:text-[#75619A]"
            >
              Admin Login
            </Link>

            <Link
              href="/cart"
              className="w-fit text-sm text-[#716A7D] transition hover:text-[#75619A]"
            >
              Shopping Cart
            </Link>

            <a
              href="mailto:support@myshopsphere.com"
              className="w-fit break-all text-sm text-[#716A7D] transition hover:text-[#75619A]"
            >
              support@myshopsphere.com
            </a>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E7E0EF] bg-white/70 p-4">
            <p className="text-sm font-semibold text-[#40384D]">
              Made with care
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#827991]">
              For your everyday style
              <FiHeart className="h-3.5 w-3.5 text-[#75619A]" />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E7E0EF]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <p className="text-xs leading-5 text-[#827991] sm:text-sm">
            © 2026 MyShopSphere. All rights reserved.
          </p>

          <p className="text-xs text-[#827991] sm:text-sm">
            Your style, your choice.
          </p>
        </div>
      </div>
    </footer>
  );
}
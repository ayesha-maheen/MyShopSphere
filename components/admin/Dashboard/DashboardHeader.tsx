"use client";

import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function DashboardHeader() {
  return (
    <header className="border-b border-[#E7E0EF] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link
          href="/admin/dashboard"
          className="text-xl font-extrabold tracking-tight text-[#65528A] sm:text-2xl"
        >
          MyShop<span className="text-[#B8A4E3]">Sphere</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-[#E7E0EF] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#EEE8F7]"
        >
          <FiHome />
          Visit Store
        </Link>
      </div>
    </header>
  );
}
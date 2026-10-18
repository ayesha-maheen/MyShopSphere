import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function DashboardQuickStart() {
  return (
    <section className="mt-8 rounded-2xl border border-[#E7E0EF] bg-white p-6 sm:p-8">
      <h2 className="text-lg font-bold">Quick Start</h2>

      <p className="mt-2 text-sm leading-6 text-[#827A8D]">
        Add products, organize categories and manage customer orders from
        your admin panel.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-xl bg-[#B8A4E3] px-5 py-3 text-sm font-bold text-[#292335] transition hover:bg-[#D8CCF0]"
        >
          Manage Products
          <FiArrowUpRight />
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E7E0EF] bg-white px-5 py-3 text-sm font-bold text-[#292335] transition hover:bg-[#EEE8F7]"
        >
          View Store Products
          <FiArrowUpRight />
        </Link>
      </div>
    </section>
  );
}
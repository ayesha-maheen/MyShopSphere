
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiHeadphones,
} from "react-icons/fi";

export default function Hero() {
  return (
    <section className="bg-[#faf8fc] pb-10 pt-5 lg:pb-14">
      {/* Shared Container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Banner */}
        <div className="relative isolate h-[480px] overflow-hidden rounded-[28px] bg-[#e9ddf3] sm:h-[500px] sm:rounded-[36px] lg:h-[480px]">
          {/* Background Image */}
          <Image
            src="/hero-lavender.png"
            alt="MyShopSphere seasonal collection"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />

          {/* Soft Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#f8f2fc]/95 via-[#f8f2fc]/75 to-[#f8f2fc]/10 sm:via-[#f8f2fc]/65 sm:to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 flex h-full items-center px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
            <div className="max-w-xl">
              <span className="mb-6 inline-flex items-center rounded-full border border-[#d8c4e8] bg-white/65 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#77558d] backdrop-blur-sm sm:text-xs">
                Discover Something Beautiful
              </span>

              <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-[#30233b] sm:text-5xl lg:text-7xl">
                Discover Your
                <span className="mt-1 block text-[#9270ac]">
                  Next Favorite.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#62566b] sm:text-base sm:leading-8">
                Explore thoughtfully selected styles and everyday essentials
                made to bring a little more beauty to your everyday life.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/products"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#76538e] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#76538e]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#624278] sm:px-8"
                >
                  Shop Collection
                  <FiArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/categories"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#cbb6db] bg-white/70 px-6 py-3 text-sm font-semibold text-[#624278] backdrop-blur-sm transition duration-300 hover:border-[#76538e] hover:bg-white sm:px-8"
                >
                  Explore Categories
                </Link>
              </div>

              <p className="mt-7 text-xs font-medium tracking-wide text-[#776881]">
                A little inspiration for every day.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Row */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {/* Delivery */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#eee6f3] bg-white px-5 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2e9f8] text-[#795894]">
              <FiTruck size={21} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#34263e]">
                Reliable Delivery
              </h3>
              <p className="mt-1 text-xs text-[#817587]">
                Shopping made convenient
              </p>
            </div>
          </div>

          {/* Secure Shopping */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#eee6f3] bg-white px-5 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2e9f8] text-[#795894]">
              <FiShield size={21} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#34263e]">
                Secure Shopping
              </h3>
              <p className="mt-1 text-xs text-[#817587]">
                Shop with confidence
              </p>
            </div>
          </div>

          {/* Customer Support */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#eee6f3] bg-white px-5 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2e9f8] text-[#795894]">
              <FiHeadphones size={21} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#34263e]">
                Customer Support
              </h3>
              <p className="mt-1 text-xs text-[#817587]">
                Here when you need us
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string | null;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="min-w-0">
      <Link
        href={`/products/${id}`}
        aria-label={`View ${name} details`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#E6E0F5] sm:rounded-3xl">
          {image && image.startsWith("/") ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="eager"
              className="object-cover transition-transform duration-300 ease-out hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No image available
            </div>
          )}
        </div>

        <div className="px-1 pt-3 sm:px-2 sm:pt-4">
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-[#292335] sm:text-base">
            {name}
          </h3>

          <p className="mt-2 text-sm font-bold text-[#292335] sm:text-base">
            Rs. {Number(price).toLocaleString("en-PK")}
          </p>
        </div>
      </Link>
    </article>
  );
}

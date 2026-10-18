import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconClassName?: string;
  description?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  iconClassName = "bg-[#EEE8F7] text-[#65528A]",
  description,
}: StatCardProps) {
  return (
    <div className="h-full rounded-2xl border border-[#E7E0EF] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#B8A4E3] hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>

        <span className="text-xl text-[#9A92A5]" aria-hidden="true">
          ↗
        </span>
      </div>

      <p className="mt-6 text-sm font-medium text-[#827A8D]">
        {title}
      </p>

      <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#292335]">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-sm leading-5 text-[#827A8D]">
          {description}
        </p>
      )}
    </div>
  );
}
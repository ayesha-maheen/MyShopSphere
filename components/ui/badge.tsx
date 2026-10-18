
import * as React from "react";

const badgeVariants = {
  default:
    "border-transparent bg-[#75619A] text-white",
  secondary:
    "border-transparent bg-[#EEE8F7] text-[#65528A]",
  destructive:
    "border-transparent bg-red-100 text-red-800",
  outline:
    "border-[#E7E0EF] bg-white text-[#65528A]",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof badgeVariants;
};

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${badgeVariants[variant]} ${className}`}
      {...props}
    />
  );
}

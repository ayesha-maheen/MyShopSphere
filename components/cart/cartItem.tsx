"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

export type CartItemData = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartItemProps = {
  item: CartItemData;
  selected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
};

export default function CartItem({
  item,
  selected,
  onSelect,
  onRemove,
  onQuantityChange,
}: CartItemProps) {
  return (
    <div
      className={`group flex gap-3 border-b border-[#E7E0EF] py-4 transition-colors ${
        selected
          ? "bg-[#EEE8F7]/50"
          : "hover:bg-[#EEE8F7]/40"
      }`}
    >
      <div className="flex items-start pt-1">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) =>
            onSelect(item.id, checked === true)
          }
          aria-label={`Select ${item.name}`}
          className="size-5 border-2 border-[#B8A4E3] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-[state=checked]:opacity-100 max-md:opacity-100"
        />
      </div>

      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-[#EEE8F7]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-[#75619A]">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-[#292335]">
          {item.name}
        </h3>

        <p className="mt-1 text-sm font-bold text-[#75619A]">
          Rs. {item.price.toLocaleString("en-PK")}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-7 border-[#E7E0EF] text-[#292335]"
              disabled={item.quantity <= 1}
              onClick={() =>
                onQuantityChange(item.id, item.quantity - 1)
              }
              aria-label="Decrease quantity"
            >
              <FiMinus size={13} />
            </Button>

            <span className="min-w-5 text-center text-sm text-[#292335]">
              {item.quantity}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-7 border-[#E7E0EF] text-[#292335]"
              onClick={() =>
                onQuantityChange(item.id, item.quantity + 1)
              }
              aria-label="Increase quantity"
            >
              <FiPlus size={13} />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-[#75619A] hover:bg-[#EEE8F7]"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name}`}
          >
            <FiTrash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

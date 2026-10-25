
export type Category = {
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

export type SortOption = "newest" | "price-low" | "price-high";

export function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getDisplayName(category: Category) {
  const prefix = category.parent ? `${category.parent.name} - ` : "";

  if (prefix && category.name.toLowerCase().startsWith(prefix.toLowerCase())) {
    return category.name.slice(prefix.length).trim();
  }

  return category.name;
}

export function formatSlugTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatPrice(price: number | string) {
  return Number(price).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  });
}


export type Category = {
  id: number;
  name: string;
  parentId: number | null;
  parent?: Category | null;
  subcategories?: Category[];
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  stock: number;
  categoryId: number;
  category?: Category | null;
};

export type ProductForm = {
  name: string;
  description: string;
  image: string;
  price: string;
  stock: string;
  categoryId: string;
};

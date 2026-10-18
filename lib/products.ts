
type Product = {
  id: string | number;
  name: string;
  price: number | string;
  image: string | null;
  [key: string]: unknown;
};

let productsPromise: Promise<Product[]> | null = null;

export function getProducts(): Promise<Product[]> {
  if (!productsPromise) {
    productsPromise = fetch("/api/products")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to fetch products"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid products response");
        }

        return data as Product[];
      })
      .catch((error) => {
        productsPromise = null;
        throw error;
      });
  }

  return productsPromise;
}

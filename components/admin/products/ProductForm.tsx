
"use client";

export type ProductFormData = {
  name: string;
  description: string;
  image: string;
  price: string;
  stock: string;
  categoryId: string;
};

export type ProductCategory = {
  id: number;
  name: string;
  parentId: number | null;
};

type Props = {
  form: ProductFormData;
  setForm: (form: ProductFormData) => void;
  categories: ProductCategory[];
  editingId: number | null;
  saving: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function ProductForm({
  form,
  setForm,
  categories,
  editingId,
  saving,
  onSubmit,
  onCancel,
}: Props) {
  const updateField = (
    field: keyof ProductFormData,
    value: string
  ) => {
    setForm({ ...form, [field]: value });
  };

  const mainCategories = categories.filter(
    (category) => category.parentId === null
  );

  const selectedCategory = categories.find(
    (category) => String(category.id) === form.categoryId
  );

  const selectedMainId = selectedCategory?.parentId
    ? String(selectedCategory.parentId)
    : form.categoryId;

  const subcategories = categories.filter(
    (category) =>
      category.parentId !== null &&
      String(category.parentId) === selectedMainId
  );

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-[#E7E0EF] bg-white p-5 sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-[#292335]">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="mt-1 text-sm text-[#827A8D]">
          Enter the product details below.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#292335]">
            Product Name *
          </label>
          <input
            required
            value={form.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            placeholder="Enter product name"
            className="w-full rounded-xl border border-[#E7E0EF] bg-[#FCFAFE] px-4 py-3 text-sm outline-none focus:border-[#B8A4E3]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#292335]">
            Image Path *
          </label>
          <input
            required
            value={form.image}
            onChange={(event) =>
              updateField("image", event.target.value)
            }
            placeholder="/products/product.png"
            className="w-full rounded-xl border border-[#E7E0EF] bg-[#FCFAFE] px-4 py-3 text-sm outline-none focus:border-[#B8A4E3]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#292335]">
            Price (Rs.) *
          </label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) =>
              updateField("price", event.target.value)
            }
            placeholder="2500"
            className="w-full rounded-xl border border-[#E7E0EF] bg-[#FCFAFE] px-4 py-3 text-sm outline-none focus:border-[#B8A4E3]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#292335]">
            Stock *
          </label>
          <input
            required
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(event) =>
              updateField("stock", event.target.value)
            }
            placeholder="10"
            className="w-full rounded-xl border border-[#E7E0EF] bg-[#FCFAFE] px-4 py-3 text-sm outline-none focus:border-[#B8A4E3]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#292335]">
            Main Category *
          </label>
          <select
            required
            value={selectedMainId}
            onChange={(event) => {
              const firstSubcategory = categories.find(
                (category) =>
                  String(category.parentId) === event.target.value
              );

              updateField(
                "categoryId",
                String(firstSubcategory?.id ?? event.target.value)
              );
            }}
            className="w-full rounded-xl border border-[#E7E0EF] bg-[#FCFAFE] px-4 py-3 text-sm outline-none focus:border-[#B8A4E3]"
          >
            <option value="">Select main category</option>
            {mainCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#292335]">
            Subcategory
          </label>
          <select
            value={
              selectedCategory?.parentId
                ? form.categoryId
                : ""
            }
            onChange={(event) =>
              updateField("categoryId", event.target.value)
            }
            disabled={!selectedMainId || subcategories.length === 0}
            className="w-full rounded-xl border border-[#E7E0EF] bg-[#FCFAFE] px-4 py-3 text-sm outline-none focus:border-[#B8A4E3] disabled:opacity-50"
          >
            <option value="">
              {subcategories.length
                ? "Select subcategory"
                : "No subcategories"}
            </option>
            {subcategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#292335]">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Describe your product..."
            className="w-full resize-y rounded-xl border border-[#E7E0EF] bg-[#FCFAFE] px-4 py-3 text-sm outline-none focus:border-[#B8A4E3]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#75619A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#65528A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : editingId
              ? "Update Product"
              : "Add Product"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border border-[#E7E0EF] px-6 py-3 text-sm font-semibold text-[#655F6F] hover:bg-[#F8F5FC] disabled:opacity-50"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

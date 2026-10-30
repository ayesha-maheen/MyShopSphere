
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          include: {
            category: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API Error:", error);

    if (error instanceof Error) {
      console.error("Underlying cause:", error.cause);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      price,
      image,
      stock,
      categoryId,
    } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      price == null ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      categoryId == null ||
      !Number.isInteger(Number(categoryId)) ||
      Number(categoryId) < 1
    ) {
      return NextResponse.json(
        {
          error: "Valid name, price and categoryId are required",
        },
        { status: 400 }
      );
    }

    if (
      stock != null &&
      (!Number.isInteger(Number(stock)) ||
        Number(stock) < 0)
    ) {
      return NextResponse.json(
        { error: "Stock must be a non-negative integer" },
        { status: 400 }
      );
    }

    if (
      description != null &&
      typeof description !== "string"
    ) {
      return NextResponse.json(
        { error: "Description must be a string" },
        { status: 400 }
      );
    }

    if (image != null && typeof image !== "string") {
      return NextResponse.json(
        { error: "Image must be a string or null" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description ?? "",
        price: Number(price),
        image: image || null,
        stock: Number(stock ?? 0),
        categoryId: Number(categoryId),
        updatedAt: new Date(),
      },
      include: {
        category: {
          include: {
            category: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error instanceof Error) {
      console.error("Underlying cause:", error.cause);
    }

    return NextResponse.json(
      {
        error: "Failed to create product",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

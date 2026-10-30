
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        category: true,
        other_category: {
          orderBy: {
            name: "asc",
          },
        },
        _count: {
          select: {
            product: true,
            other_category: true,
          },
        },
      },
    });

    const formattedCategories = categories.map((item) => ({
      ...item,
      parent: item.category,
      subcategories: item.other_category,
      _count: {
        product: item._count.product,
        subcategories: item._count.other_category,
      },
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching public categories:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

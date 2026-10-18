import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        parent: true,
        subcategories: {
          orderBy: {
            name: "asc",
          },
        },
        _count: {
          select: {
            product: true,
            subcategories: true,
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching public categories:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories.",
      },
      { status: 500 }
    );
  }
}
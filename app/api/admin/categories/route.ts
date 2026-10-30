
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get("admin_session")?.value;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!token || !secret) return false;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}

function unauthorized() {
  return NextResponse.json(
    { error: "Unauthorized. Admin login required." },
    { status: 401 }
  );
}

async function validParent(parentId: unknown) {
  if (
    parentId === null ||
    parentId === undefined ||
    parentId === ""
  ) {
    return { valid: true, parentId: null as number | null };
  }

  const id = Number(parentId);

  if (!Number.isInteger(id) || id <= 0) {
    return { valid: false, parentId: null };
  }

  const parent = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  return {
    valid: Boolean(parent),
    parentId: parent ? id : null,
  };
}

// GET: Fetch all categories
export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            product: true,
            other_category: true,
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET categories error:", error);

    return NextResponse.json(
      {
        error: "Categories could not be loaded.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST: Create category
export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    const parent = await validParent(body.parentId);

    if (!parent.valid) {
      return NextResponse.json(
        { error: "Selected parent category does not exist." },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This category name already exists." },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        parentId: parent.parentId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);

    return NextResponse.json(
      {
        error: "Category could not be created.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT: Update category
export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();

  try {
    const body = await request.json();

    const id = Number(body.id);
    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    if (!Number.isInteger(id) || id <= 0 || !name) {
      return NextResponse.json(
        { error: "Valid category ID and name are required." },
        { status: 400 }
      );
    }

    const current = await prisma.category.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    const duplicate = await prisma.category.findUnique({
      where: { name },
    });

    if (duplicate && duplicate.id !== id) {
      return NextResponse.json(
        { error: "This category name already exists." },
        { status: 409 }
      );
    }

    const parent = await validParent(body.parentId);

    if (!parent.valid) {
      return NextResponse.json(
        { error: "Selected parent category does not exist." },
        { status: 400 }
      );
    }

    if (parent.parentId === id) {
      return NextResponse.json(
        { error: "A category cannot be its own parent." },
        { status: 400 }
      );
    }

    let ancestorId = parent.parentId;

    while (ancestorId !== null) {
      if (ancestorId === id) {
        return NextResponse.json(
          {
            error:
              "A category cannot be moved inside its own subcategory.",
          },
          { status: 400 }
        );
      }

      const ancestor = await prisma.category.findUnique({
        where: { id: ancestorId },
        select: { parentId: true },
      });

      ancestorId = ancestor?.parentId ?? null;
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        parentId: parent.parentId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("PUT category error:", error);

    return NextResponse.json(
      {
        error: "Category could not be updated.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete category
export async function DELETE(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();

  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Valid category ID is required." },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            product: true,
            other_category: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    if (
      category._count.product > 0 ||
      category._count.other_category > 0
    ) {
      return NextResponse.json(
        {
          error:
            "This category contains products or subcategories. Remove or reassign them before deleting it.",
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE category error:", error);

    return NextResponse.json(
      {
        error: "Category could not be deleted.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

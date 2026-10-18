
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

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { message: "Unauthorized. Admin login required." },
        { status: 401 }
      );
    }

    const [
      totalProducts,
      totalCategories,
      totalCustomers,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      salesResult,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "CONFIRMED" } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          orderitem: {
            include: {
              product: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalCategories,
        totalCustomers,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        totalSales: Number(salesResult._sum.total ?? 0),
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return NextResponse.json(
      { message: "Failed to load dashboard data." },
      { status: 500 }
    );
  }
}
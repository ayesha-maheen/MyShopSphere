
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
        { error: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        orderitem: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin orders GET error:", error);

    return NextResponse.json(
      { error: "Orders load nahi huay." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const orderId = Number(body.orderId);
    const status = body.status;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (
      !Number.isSafeInteger(orderId) ||
      orderId < 1 ||
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid order ID ya status." },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order nahi mila." },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Order status update ho gaya.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Admin orders PATCH error:", error);

    return NextResponse.json(
      { error: "Order status update nahi hua." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderitem: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin orders fetch failed:", error);

    return NextResponse.json(
      { error: "Orders load nahi ho sake." },
      { status: 500 }
    );
  }
}

type RequestedItem = {
  productId: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerName =
      typeof body.customerName === "string"
        ? body.customerName.trim()
        : "";

    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";

    const address =
      typeof body.address === "string" ? body.address.trim() : "";

    if (
      !customerName ||
      customerName.length > 150 ||
      !/^03[0-9]{9}$/.test(phone) ||
      !address ||
      address.length > 2000
    ) {
      return NextResponse.json(
        {
          error:
            "Name, phone aur delivery address check karein. Phone 03 se start hone wala 11-digit number hona chahiye.",
        },
        { status: 400 }
      );
    }

    let requestedItems: RequestedItem[];

    if (Array.isArray(body.items)) {
      requestedItems = body.items.map(
        (item: { productId?: unknown; quantity?: unknown }) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })
      );
    } else {
      // Existing Buy Now requests remain supported.
      requestedItems = [
        {
          productId: Number(body.productId),
          quantity: Number(body.quantity),
        },
      ];
    }

    if (
      requestedItems.length === 0 ||
      requestedItems.length > 100 ||
      requestedItems.some(
        (item) =>
          !Number.isSafeInteger(item.productId) ||
          item.productId < 1 ||
          !Number.isSafeInteger(item.quantity) ||
          item.quantity < 1
      )
    ) {
      return NextResponse.json(
        { error: "Cart ke products aur quantities valid nahi hain." },
        { status: 400 }
      );
    }

    // Combine repeated product IDs into one line item.
    const quantities = new Map<number, number>();

    for (const item of requestedItems) {
      const nextQuantity =
        (quantities.get(item.productId) ?? 0) + item.quantity;

      if (!Number.isSafeInteger(nextQuantity)) {
        return NextResponse.json(
          { error: "Product quantity valid nahi hai." },
          { status: 400 }
        );
      }

      quantities.set(item.productId, nextQuantity);
    }

    const items = Array.from(quantities, ([productId, quantity]) => ({
      productId,
      quantity,
    }));

    const result = await prisma.$transaction(async (tx) => {
      const orderItems: {
        productId: number;
        quantity: number;
        price: number;
      }[] = [];

      let total = 0;

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error("PRODUCT_NOT_FOUND");
        }

        if (product.stock < item.quantity) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        const stockUpdate = await tx.product.updateMany({
          where: {
            id: product.id,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
            updatedAt: new Date(),
          },
        });

        if (stockUpdate.count !== 1) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        const price = Number(product.price);

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price,
        });

        total += price * item.quantity;
      }

      const order = await tx.order.create({
        data: {
          userId: null,
          customerName,
          phone,
          paymentMethod: "COD",
          total,
          status: "PENDING",
          address,
          updatedAt: new Date(),
          orderitem: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderitem: true,
        },
      });

      return {
        id: order.id,
        customerName: order.customerName,
        phone: order.phone,
        total: Number(order.total),
        status: order.status,
        items: order.orderitem,
      };
    });

    return NextResponse.json(
      {
        message: "Order placed successfully.",
        order: result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { error: "Cart mein koi product nahi mila." },
          { status: 404 }
        );
      }

      if (error.message === "INSUFFICIENT_STOCK") {
        return NextResponse.json(
          {
            error:
              "Kisi product ka stock change ho gaya hai ya requested quantity available nahi hai. Cart dobara check karein.",
          },
          { status: 409 }
        );
      }
    }

    console.error("Order creation failed:", error);

    return NextResponse.json(
      { error: "Order place nahi ho saka. Dobara try karein." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!secret) {
      return NextResponse.json(
        { message: "Server session configuration is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (
      !user ||
      user.role !== "ADMIN" ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const key = new TextEncoder().encode(secret);

    const token = await new SignJWT({
      role: "ADMIN",
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(String(user.id))
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(key);

    const response = NextResponse.json({
      message: "Admin login successful.",
      redirect: "/admin/dashboard",
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const { email, username, password } = await request.json();

  if ((!email && !username) || !password) {
    return NextResponse.json(
      { message: "Email or Username, and Password are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email || "" }, { username: username || "" }],
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        locationLatitude: user.locationLatitude,
        locationLongitude: user.locationLongitude,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          locationLatitude: user.locationLatitude,
          locationLongitude: user.locationLongitude,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error logging in", error: (error as Error).message },
      { status: 500 }
    );
  }
}

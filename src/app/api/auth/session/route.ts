import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Token required" }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jose.jwtVerify(token, secret);
    console.log("payload", payload);

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        speciality: true,
        bio: true,
        meetingPrice: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error verifying token" },
      { status: 500 }
    );
  }
}

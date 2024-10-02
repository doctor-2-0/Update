import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { userId, url } = await request.json();
  try {
    const media = await prisma.media.create({
      data: {
        userId,
        url,
      },
    });
    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating media", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  try {
    const media = await prisma.media.findUnique({
      where: { userId: Number(userId) },
    });
    return NextResponse.json(media, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching media", error },
      { status: 500 }
    );
  }
}

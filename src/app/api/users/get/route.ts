import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving users", error: (error as Error).message },
      { status: 500 }
    );
  }
}

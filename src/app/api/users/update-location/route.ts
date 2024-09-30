import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const user = JSON.parse(request.headers.get("user") || "{}");
  const { latitude, longitude } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: { locationLatitude: latitude, locationLongitude: longitude },
    });

    return NextResponse.json({ message: "Location updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating location", error: (error as Error).message },
      { status: 500 }
    );
  }
}

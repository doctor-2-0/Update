import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = JSON.parse(request.headers.get("user") || "{}");

  try {
    const userLocation = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { locationLatitude: true, locationLongitude: true },
    });

    if (!userLocation) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User location retrieved successfully",
      location: {
        latitude: userLocation.locationLatitude,
        longitude: userLocation.locationLongitude,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error retrieving user location",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

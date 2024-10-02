import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  if (!latitude || !longitude) {
    return NextResponse.json(
      { message: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await response.json();
    return NextResponse.json({ placeName: data.display_name });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching place name", error: (error as Error).message },
      { status: 500 }
    );
  }
}

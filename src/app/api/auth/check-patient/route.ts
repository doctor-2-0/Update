import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = JSON.parse(request.headers.get("user") || "{}");
    const isPatient = user.role === "Patient";

    return NextResponse.json({ isPatient }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error checking patient status" },
      { status: 500 }
    );
  }
}

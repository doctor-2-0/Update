import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = JSON.parse(request.headers.get("user") || "{}");
    console.log(user, "user ----------------");
    const isDoctor = user.role === "Doctor";

    return NextResponse.json({ isDoctor }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error checking doctor status" },
      { status: 500 }
    );
  }
}

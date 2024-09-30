import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Token required" }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jose.jwtVerify(token, secret);

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error verifying token" },
      { status: 500 }
    );
  }
}

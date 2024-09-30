import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  console.log("Middleware execution started for:", request.url);

  const token = request.headers.get("authorization")?.split(" ")[1];
  console.log("Token in middleware:", token);

  if (!token) {
    console.log("No token found, returning 401");
    return NextResponse.json(
      { message: "Authentication failed. Token missing." },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("user", JSON.stringify(payload));

    console.log("Token verified, proceeding to route handler");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.log("Token verification error:", error);
    if (error instanceof jose.errors.JWTExpired) {
      return NextResponse.json(
        { message: "Token expired", code: "TOKEN_EXPIRED" },
        { status: 401 }
      );
    }
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    "/api/appointments/:path*",
    "/api/patients/:path*",
    "/api/auth/check-doctor/:path*",
    "/api/auth/check-patient/:path*",
    "/api/users/:path*",
    "/api/chatroom/:path*",
  ],
};

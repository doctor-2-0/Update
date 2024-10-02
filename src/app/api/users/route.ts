import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const role = searchParams.get("role");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  try {
    const where = role ? { role: role as Role } : {};
    const users = await prisma.user.findMany({
      where,
      skip,
      take: parsedLimit,
      orderBy: { [sortBy]: order },
    });
    const total = await prisma.user.count({ where });

    return NextResponse.json({
      users,
      currentPage: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      totalUsers: total,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { id, status } = await request.json();
  try {
    const appointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status },
    });
    return NextResponse.json({ success: true, appointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating appointment status", error },
      { status: 500 }
    );
  }
}

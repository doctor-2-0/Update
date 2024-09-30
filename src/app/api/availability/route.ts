import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { doctorId, availableDate, startTime, endTime } = await request.json();
  try {
    const availability = await prisma.availability.create({
      data: {
        doctorId,
        availableDate: new Date(availableDate),
        startTime,
        endTime,
      },
    });
    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating availability", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  try {
    const availabilities = await prisma.availability.findMany({
      where: { doctorId: Number(doctorId) },
    });
    return NextResponse.json(availabilities, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching availabilities", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    await prisma.availability.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "Availability deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting availability", error },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const doctorId = parseInt(params.id);

  if (isNaN(doctorId)) {
    return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
  }

  try {
    // Check if the doctor exists
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: "Doctor" },
      select: { firstName: true, lastName: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Get the availability for the doctor
    const availability = await prisma.availability.findMany({
      where: { doctorId },
      orderBy: [{ availableDate: "asc" }, { startTime: "asc" }],
    });

    // If no availability is found, return an appropriate message
    if (availability.length === 0) {
      return NextResponse.json({
        message: "No availability set for this doctor",
        availability: [],
      });
    }

    return NextResponse.json({
      message: "Availability retrieved successfully",
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
      availability,
    });
  } catch (error) {
    console.error("Error in getDoctorAvailability:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve availability",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

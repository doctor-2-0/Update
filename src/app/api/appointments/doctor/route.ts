import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = JSON.parse(request.headers.get("user") || "{}");
    const doctorId = user.userId;

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctorId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { appointmentDate: "asc" },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error getting appointments",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "Patient" },
      include: {
        patientAppointments: true,
        doctorReviews: true,
        availability: true,
      },
    });

    const filteredUsers = users.filter(
      (user) => user.patientAppointments.length > 0
    );

    return NextResponse.json(filteredUsers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error getting user profile", error },
      { status: 500 }
    );
  }
}

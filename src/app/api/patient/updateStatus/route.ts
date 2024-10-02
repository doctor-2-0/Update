import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const { id, status } = await request.json();

  console.log("Updating appointment:", id, status);

  try {
    const appointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status: status.toUpperCase() },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    console.log("Appointment updated successfully:", appointment);
    return NextResponse.json({ success: true, appointment }, { status: 200 });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return NextResponse.json(
      {
        message: "Error updating appointment status",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const doctorId = params.id;
  console.log("doctorId", doctorId);

  if (!doctorId) {
    return NextResponse.json(
      { error: "DoctorId is required" },
      { status: 400 }
    );
  }

  try {
    console.log("doctorIddddddddddddddddddddddd----------------", doctorId);

    // Fetch doctor's availability
    const availabilities = await prisma.availability.findMany({
      where: {
        doctorId: Number(doctorId),
        availableDate: {
          gte: new Date(),
        },
      },
      orderBy: [{ availableDate: "asc" }, { startTime: "asc" }],
    });

    // Fetch confirmed appointments
    const confirmedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: Number(doctorId),
        status: "CONFIRMED",
        appointmentDate: {
          gte: new Date(),
        },
      },
    });

    // Process available slots
    const availableSlots = availabilities.flatMap((slot) => {
      const date = slot.availableDate;
      const startTime = new Date(
        `${date.toISOString().split("T")[0]}T${slot.startTime}`
      );
      const endTime = new Date(
        `${date.toISOString().split("T")[0]}T${slot.endTime}`
      );
      const slots = [];

      while (startTime < endTime) {
        const slotEndTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour slots
        const isBooked = confirmedAppointments.some((appointment) => {
          const appointmentStart = new Date(appointment.appointmentDate);
          const appointmentEnd = new Date(
            appointmentStart.getTime() + appointment.durationMinutes * 60 * 1000
          );
          return appointmentStart < slotEndTime && appointmentEnd > startTime;
        });

        if (!isBooked) {
          slots.push({
            date: date.toISOString().split("T")[0],
            startTime: startTime.toTimeString().slice(0, 5),
            endTime: slotEndTime.toTimeString().slice(0, 5),
          });
        }

        startTime.setTime(slotEndTime.getTime());
      }

      return slots;
    });

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error("Error retrieving available slots:", error);
    return NextResponse.json(
      { error: "Failed to retrieve available slots" },
      { status: 500 }
    );
  }
}

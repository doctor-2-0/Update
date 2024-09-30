import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { patientId, doctorId, appointmentDate, durationMinutes } =
    await request.json();
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        durationMinutes,
        status: "PENDING",
      },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating appointment", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        OR: [{ patientId: Number(userId) }, { doctorId: Number(userId) }],
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } },
      },
    });
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching appointments", error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { id, ...updateData } = await request.json();
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: updateData,
    });
    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating appointment", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    await prisma.appointment.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting appointment", error },
      { status: 500 }
    );
  }
}

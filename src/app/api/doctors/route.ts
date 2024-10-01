import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export interface Doctor {
  id: number;
  firstName: string | null; 
  lastName: string | null; 
  email: string;
  speciality: string | null; 
  locationLatitude: number | null; 
  locationLongitude: number | null; 
  bio: string | null; 
}

export async function GET(request: NextRequest) {
  try {
    const doctors: Doctor[] = await prisma.user.findMany({
      where: { role: "Doctor" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        speciality: true,
        bio: true,
        locationLatitude: true,
        locationLongitude: true,
        email: true,
      },
    });

    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error("Error retrieving doctors:", error);
    return NextResponse.json(
      { message: "Error retrieving doctors", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const doctorData: Doctor = await request.json();
  try {
    const doctor = await prisma.user.create({
      data: {
        ...doctorData,
        role: "Doctor",
        username: "yourUsername",
        password: "yourPassword" 
      },
    });
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating doctor profile", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { id, ...updateData }: Doctor = await request.json();
  try {
    const updatedDoctor = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });
    return NextResponse.json(updatedDoctor, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating doctor profile", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    await prisma.user.delete({
      where: { id: Number(id), role: "Doctor" },
    });
    return NextResponse.json(
      { message: "Doctor profile deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting doctor profile", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
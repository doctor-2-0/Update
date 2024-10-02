import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const {
    FirstName,
    LastName,
    Username,
    Password,
    Email,
    Role,
    Specialty,
    Bio,
    MeetingPrice,
    Latitude,
    Longitude,
  } = await request.json();

  if (Role !== "Doctor" && Role !== "Patient") {
    return NextResponse.json(
      { message: "Invalid role. Only Doctor or Patient can register." },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: FirstName,
        lastName: LastName,
        username: Username,
        password: hashedPassword,
        email: Email,
        role: Role,
        ...(Role === "Doctor" && {
          speciality: Specialty,
          bio: Bio,
          meetingPrice: parseFloat(MeetingPrice),
        }),
        locationLatitude: parseFloat(Latitude),
        locationLongitude: parseFloat(Longitude),
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error registering user", error: (error as Error).message },
      { status: 500 }
    );
  }
}

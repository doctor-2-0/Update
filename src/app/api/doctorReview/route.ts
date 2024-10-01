import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { patientId, doctorId, rating, reviewText } = await request.json();
  try {
    const review = await prisma.doctorReview.create({
      data: {
        patientId,
        doctorId,
        rating,
        reviewText,
        reviewDate: new Date(),
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating review", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  try {
    const reviews = await prisma.doctorReview.findMany({
      where: { doctorId: Number(doctorId) },
      include: { patient: { select: { firstName: true, lastName: true } } },
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching reviews", error },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure this path is correct

// POST request to create a new review
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
    console.error("Error creating review:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Error creating review", error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// GET request to fetch reviews for a specific doctor
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  
  if (!doctorId) {
    return NextResponse.json(
      { message: "Doctor ID is required" },
      { status: 400 }
    );
  }

  try {
    const reviews = await prisma.doctorReview.findMany({
      where: { doctorId: Number(doctorId) },
      include: { patient: { select: { firstName: true, lastName: true } } },
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Error fetching reviews", error: "An unexpected error occurred."  },
      { status: 500 }
    );
  }
}
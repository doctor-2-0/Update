import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = JSON.parse(request.headers.get("user") || "{}");
  console.log("user", user);
  if (!user || !user.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { rating, reviewText } = await request.json();
  const doctorId = parseInt(params.id);

  try {
    // Check if the patient has had an appointment with the doctor
    const appointment = await prisma.appointment.findFirst({
      where: {
        patientId: user.userId,
        doctorId: doctorId,
        status: "CONFIRMED",
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "You can only review doctors you've had appointments with" },
        { status: 403 }
      );
    }

    const review = await prisma.doctorReview.create({
      data: {
        patientId: user.id,
        doctorId: doctorId,
        rating,
        reviewText,
        reviewDate: new Date(),
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Error creating review", error },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const doctorId = parseInt(params.id);
  try {
    const reviews = await prisma.doctorReview.findMany({
      where: { doctorId: doctorId },
      include: { patient: { select: { firstName: true, lastName: true } } },
      orderBy: { reviewDate: "desc" },
    });
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      patientName: `${review.patient.firstName} ${review.patient.lastName}`,
      rating: review.rating,
      reviewText: review.reviewText,
      reviewDate: review.reviewDate.toISOString(),
    }));
    return NextResponse.json(formattedReviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching reviews", error },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { name: any } }
) {
  try {
    const firstname = params.name;
    const user = JSON.parse(request.headers.get("user") || "{}");

    if (!firstname) {
      return NextResponse.json(
        { message: "Participant username is required" },
        { status: 400 }
      );
    }

    const participant = await prisma.user.findFirst({
      where: { firstName: firstname },
    });
    if (!participant) {
      return NextResponse.json(
        { message: "Participant not found" },
        { status: 404 }
      );
    }

    let doctorId, patientId;
    if (user.role === "Doctor") {
      doctorId = user.userId;
      patientId = participant.id;
    } else {
      doctorId = participant.id;
      patientId = user.userId;
    }

    if (!doctorId || !patientId) {
      return NextResponse.json(
        { message: "Invalid doctor or patient ID" },
        { status: 400 }
      );
    }

    const existingChatRoom = await prisma.chatroom.findFirst({
      where: {
        AND: [{ doctorId }, { patientId }],
      },
    });

    if (existingChatRoom) {
      return NextResponse.json(
        {
          message: "Chat room already exists",
          chatRoom: existingChatRoom,
        },
        { status: 409 }
      );
    }

    const newChatRoom = await prisma.chatroom.create({
      data: {
        doctorId,
        patientId,
      },
    });

    return NextResponse.json(
      {
        message: "Chat room created successfully",
        chatRoom: newChatRoom,
      },
      { status: 201 }
    );
  } catch (error) {
    throw error;
    console.error("Error creating chat room:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

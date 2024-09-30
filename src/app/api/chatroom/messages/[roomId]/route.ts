import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: any } }
) {
  try {
    const chatroomId = parseInt(params.roomId);

    const user = JSON.parse(request.headers.get("user") || "{}");

    const chatroom = await prisma.chatroom.findUnique({
      where: { id: chatroomId },
    });

    if (!chatroom) {
      return NextResponse.json(
        { message: "Chatroom not found" },
        { status: 404 }
      );
    }

    if (
      chatroom.doctorId !== user.userId &&
      chatroom.patientId !== user.userId
    ) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const messages = await prisma.chatroomMessage.findMany({
      where: { chatroomId: chatroomId },
      include: {
        sender: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat room messages:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

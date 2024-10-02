import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { chatroomId, messageText } = await request.json();
    const user = JSON.parse(request.headers.get("user") || "{}");

    if (!chatroomId || !messageText) {
      return NextResponse.json(
        { message: "ChatroomID and messageText are required" },
        { status: 400 }
      );
    }

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

    const newMessage = await prisma.chatroomMessage.create({
      data: {
        chatroomId,
        senderId: user.userId,
        messageText,
        sentAt: new Date(),
      },
      include: {
        sender: {
          select: { id: true, username: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Message sent successfully",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

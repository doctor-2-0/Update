import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { chatroomId, senderId, messageText } = await request.json();
  try {
    const message = await prisma.chatroomMessage.create({
      data: {
        chatroomId,
        senderId,
        messageText,
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating message", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chatroomId = searchParams.get("chatroomId");
  try {
    const messages = await prisma.chatroomMessage.findMany({
      where: { chatroomId: Number(chatroomId) },
      include: { sender: { select: { firstName: true, lastName: true } } },
      orderBy: { sentAt: "asc" },
    });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching messages", error },
      { status: 500 }
    );
  }
}

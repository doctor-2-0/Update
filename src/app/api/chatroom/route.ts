import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get("userId");
//   try {
//     const chatrooms = await prisma.chatroom.findMany({
//       where: {
//         OR: [{ patientId: Number(userId) }, { doctorId: Number(userId) }],
//       },
//       include: {
//         patient: { select: { firstName: true, lastName: true } },
//         doctor: { select: { firstName: true, lastName: true } },
//       },
//     });
//     return NextResponse.json(chatrooms, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Error fetching chatrooms", error },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const user = JSON.parse(request.headers.get("user") || "{}");

    const userId = user.userId;
    const userRole = user.role;
    console.log(userId, userRole, "=====================================");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    let chatRooms;

    if (userRole === "Doctor") {
      chatRooms = await prisma.chatroom.findMany({
        where: { doctorId: userId },
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (userRole === "Patient") {
      chatRooms = await prisma.chatroom.findMany({
        where: { patientId: userId },
        include: {
          doctor: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json(
        { message: "Invalid user role" },
        { status: 403 }
      );
    }

    return NextResponse.json(chatRooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching user chat rooms:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

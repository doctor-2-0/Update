import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
export async function GET(request: NextRequest) {
  console.log("Profile GET route called", request.headers.get("user"));
  const user = JSON.parse(request.headers.get("user") || "{}");
  console.log("User from headers:", user);

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { profilePicture: true },
    });

    if (!userProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const profile = {
      ...userProfile,
      photoUrl: userProfile.profilePicture
        ? userProfile.profilePicture.url
        : null,
    };
    console.log("Profile:", profile);

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error fetching user profile",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest) {
  const user = JSON.parse(request.headers.get("user") || "{}");
  const { firstName, lastName, email, photoUrl, password } =
    await request.json();

  try {
    let updateData: any = { firstName, lastName, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (photoUrl) {
      const existingMedia = await prisma.media.findUnique({
        where: { userId: user.userId },
      });

      if (existingMedia) {
        await prisma.media.update({
          where: { id: existingMedia.id },
          data: { url: photoUrl },
        });
      } else {
        const newMedia = await prisma.media.create({
          data: { url: photoUrl, userId: user.userId },
        });
        updateData.profilePictureId = newMedia.id;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
    });

    return NextResponse.json({ message: "User profile updated successfully" });
  } catch (error) {
    console.log("Error updating user profile", error);
    return NextResponse.json(
      {
        message: "Error updating user profile",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

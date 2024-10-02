import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      speciality,
      available,
      nearMe,
      perimeter,
      latitude,
      longitude,
      coords,
    } = await request.json();
    console.log(
      name,
      speciality,
      available,
      nearMe,
      perimeter,
      latitude,
      longitude,
      coords
    );

    const userLocation = coords;

    let whereClause: any = { role: "Doctor" };

    if (name) whereClause.firstName = { contains: name };
    if (speciality) whereClause.speciality = { contains: speciality };
    if (available) whereClause.available = true;

    const doctors = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        speciality: true,
        bio: true,
        locationLatitude: true,
        locationLongitude: true,
        profilePicture: {
          select: {
            url: true,
          },
        },
      },
    });

    let filteredDoctors = doctors;

    const searchLatitude = latitude || userLocation?.locationLatitude;
    const searchLongitude = longitude || userLocation?.locationLongitude;

    if (searchLatitude && searchLongitude && (nearMe || perimeter !== null)) {
      const searchPerimeter = nearMe ? 20 : perimeter;
      filteredDoctors = doctors.filter((doctor) => {
        if (doctor.locationLatitude && doctor.locationLongitude) {
          const distance = calculateDistance(
            searchLatitude,
            searchLongitude,
            doctor.locationLatitude,
            doctor.locationLongitude
          );
          return searchPerimeter === null || distance <= searchPerimeter;
        }
        return false;
      });
    }

    const doctorsWithMedia = filteredDoctors.map((doctor) => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      speciality: doctor.speciality,
      bio: doctor.bio,
      locationLatitude: doctor.locationLatitude,
      locationLongitude: doctor.locationLongitude,
      imageUrl: doctor.profilePicture?.url || null,
    }));

    return NextResponse.json(doctorsWithMedia, { status: 200 });
  } catch (error) {
    console.error("Error in searchDoctors:", error);
    return NextResponse.json(
      {
        message: "Error searching doctors",
        error: (error as Error).toString(),
      },
      { status: 500 }
    );
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

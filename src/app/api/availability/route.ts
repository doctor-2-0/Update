import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { doctorId, availableDate, startTime, endTime } = req.body;
    try {
      const availability = await prisma.availability.create({
        data: {
          doctorId,
          availableDate: new Date(availableDate),
          startTime,
          endTime,
        },
      });
      res.status(201).json(availability);
    } catch (error) {
      res.status(500).json({ message: "Error creating availability", error });
    }
  } else if (req.method === "GET") {
    const { doctorId } = req.query;
    try {
      const availabilities = await prisma.availability.findMany({
        where: { doctorId: Number(doctorId) },
      });
      res.status(200).json(availabilities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching availabilities", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

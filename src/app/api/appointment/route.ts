import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { patientId, doctorId, appointmentDate, durationMinutes } = req.body;
    try {
      const appointment = await prisma.appointment.create({
        data: {
          patientId,
          doctorId,
          appointmentDate: new Date(appointmentDate),
          durationMinutes,
          status: "PENDING",
        },
      });
      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error creating appointment", error });
    }
  } else if (req.method === "GET") {
    try {
      const appointments = await prisma.appointment.findMany({
        include: {
          patient: { select: { firstName: true, lastName: true } },
          doctor: { select: { firstName: true, lastName: true } },
        },
      });
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

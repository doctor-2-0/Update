import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { patientId, doctorId } = req.body;
    try {
      const chatroom = await prisma.chatroom.create({
        data: {
          patientId,
          doctorId,
        },
      });
      res.status(201).json(chatroom);
    } catch (error) {
      res.status(500).json({ message: "Error creating chatroom", error });
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const chatrooms = await prisma.chatroom.findMany({
        where: {
          OR: [{ patientId: Number(userId) }, { doctorId: Number(userId) }],
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          doctor: { select: { firstName: true, lastName: true } },
        },
      });
      res.status(200).json(chatrooms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chatrooms", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { chatroomId, senderId, messageText } = req.body;
    try {
      const message = await prisma.chatroomMessage.create({
        data: {
          chatroomId,
          senderId,
          messageText,
        },
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Error creating message", error });
    }
  } else if (req.method === "GET") {
    const { chatroomId } = req.query;
    try {
      const messages = await prisma.chatroomMessage.findMany({
        where: { chatroomId: Number(chatroomId) },
        include: { sender: { select: { firstName: true, lastName: true } } },
        orderBy: { sentAt: "asc" },
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

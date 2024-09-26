import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, url } = req.body;
    try {
      const media = await prisma.media.create({
        data: {
          userId,
          url,
        },
      });
      res.status(201).json(media);
    } catch (error) {
      res.status(500).json({ message: "Error creating media", error });
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const media = await prisma.media.findUnique({
        where: { userId: Number(userId) },
      });
      res.status(200).json(media);
    } catch (error) {
      res.status(500).json({ message: "Error fetching media", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

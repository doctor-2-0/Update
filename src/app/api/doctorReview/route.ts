import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { patientId, doctorId, rating, reviewText } = req.body;
    try {
      const review = await prisma.doctorReview.create({
        data: {
          patientId,
          doctorId,
          rating,
          reviewText,
          reviewDate: new Date(),
        },
      });
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: "Error creating review", error });
    }
  } else if (req.method === "GET") {
    const { doctorId } = req.query;
    try {
      const reviews = await prisma.doctorReview.findMany({
        where: { doctorId: Number(doctorId) },
        include: { patient: { select: { firstName: true, lastName: true } } },
      });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

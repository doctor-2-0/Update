import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { patientId, doctorId, rating, comment } = req.body
    try {
      const review = await prisma.doctorReview.create({
        data: {
          patientId,
          doctorId,
          rating,
          comment,
        },
      })
      res.status(201).json(review)
    } catch (error) {
      res.status(500).json({ message: 'Error creating review', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

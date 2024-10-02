import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  })
  return user
}

export async function updateUser(id: string, data: Partial<User>) {
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id, 10) },
    data,
  })
  return updatedUser
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id: parseInt(id, 10) },
  })
}

export async function createUser(data: Partial<User>) {
  const newUser = await prisma.user.create({
    data: {
      ...data,
      email: data.email as string,
      role: data.role || 'user', // Provide a default role if undefined
    },
  })
  return newUser
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })
  return user
}

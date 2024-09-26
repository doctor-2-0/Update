import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { User, Role } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "POST":
      return createUser(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const {
    page = "1",
    limit = "10",
    role,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;
  const parsedPage = parseInt(page as string, 10);
  const parsedLimit = parseInt(limit as string, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  try {
    const where = role ? { role: role as Role } : {};
    const users = await prisma.user.findMany({
      where,
      skip,
      take: parsedLimit,
      orderBy: { [sortBy as string]: order },
    });
    const total = await prisma.user.count({ where });

    res.status(200).json({
      users,
      currentPage: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      totalUsers: total,
    });
  } catch (error) {
    handleError(res, "Error fetching users", error);
  }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, role, ...otherData } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // hash password here oiiiii
        role,
        ...otherData,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    handleError(res, "Error creating user", error);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

export async function updateUser(id: string, data: Partial<User>) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

function handleError(res: NextApiResponse, message: string, error: any) {
  console.error(`${message}:`, error);
  res.status(500).json({ message, error: error.message });
}

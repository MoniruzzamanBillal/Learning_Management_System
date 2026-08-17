import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { TCreateErrorLog } from "./errorLog.interface";

// ! for storing an error, called internally from globalErrorHandler only
const logError = async (payload: TCreateErrorLog) => {
  try {
    await prisma.errorLog.create({
      data: {
        ...payload,
        errorSources: payload.errorSources as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error("Failed to persist error log:", error);
  }
};

// ! for getting all error logs (admin only)
const getAllErrorLogs = async () => {
  const result = await prisma.errorLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  // Reshapes `user` into the `userId` key, matching the original Mongoose
  // `.populate("userId", "name email")`'s in-place-replacement behavior —
  // keeps the frontend contract (`userId: {id, name, email} | null`)
  // unchanged by this migration.
  return result.map(({ user, ...rest }) => ({ ...rest, userId: user }));
};

// ! for getting a single error log's detail (admin only)
const getErrorLogById = async (id: string) => {
  const result = await prisma.errorLog.findUnique({ where: { id } });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This error log doesn't exist!!!"
    );
  }

  return result;
};

// ! for deleting error logs older than 30 days — replaces the Mongo TTL
// index, which has no Postgres/Prisma equivalent. Called from the Vercel
// Cron route only (see errorLog.route.ts).
const cleanupOldErrorLogs = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await prisma.errorLog.deleteMany({
    where: { createdAt: { lt: thirtyDaysAgo } },
  });

  return { deletedCount: result.count };
};

export const errorLogServices = {
  logError,
  getAllErrorLogs,
  getErrorLogById,
  cleanupOldErrorLogs,
};

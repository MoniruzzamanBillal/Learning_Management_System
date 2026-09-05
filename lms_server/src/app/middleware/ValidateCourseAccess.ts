import httpStatus from "http-status";
import AppError from "../Error/AppError";
import { PAYMENTSTATUS } from "../modules/payment/payment.constant";
import prisma from "../util/prisma";
import catchAsync from "../util/catchAsync";

const ValidateCourseAccess = catchAsync(async (req, res, next) => {
  const userId = req?.user?.userId;
  const courseId = req?.params?.courseId as string;

  const enrollment = await prisma.courseEnrollment.findFirst({
    where: { userId, courseId },
  });

  if (!enrollment) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You have not enrolled in this course!"
    );
  }

  const payment = await prisma.payment.findFirst({
    where: { userId, courseId, paymentStatus: PAYMENTSTATUS.Completed },
  });

  if (!payment) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Payment is not completed for this course!"
    );
  }

  next();
});

export default ValidateCourseAccess;

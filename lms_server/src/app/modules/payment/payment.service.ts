/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { PAYMENTSTATUS } from "./payment.constant";

// ! after successfully payment
const successfullyPayment = async (payload: any) => {
  const { tran_id, status } = payload;

  if (status !== "VALID") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment Failed !!!");
  }

  const existingPayment = await prisma.payment.findFirst({
    where: { transactionId: tran_id },
  });

  if (!existingPayment) {
    return null;
  }

  const updatedPaymentResult = await prisma.payment.update({
    where: { id: existingPayment.id },
    data: { paymentStatus: PAYMENTSTATUS.Completed },
  });

  return updatedPaymentResult;

  //
};

// ! for fail paymnet
const failPayment = async (payload: any) => {
  const { tran_id, status } = payload;

  if (status === "FAILED") {
    //
    const existingPayment = await prisma.payment.findFirst({
      where: { transactionId: tran_id, paymentStatus: PAYMENTSTATUS.Pending },
    });

    if (!existingPayment) {
      return null;
    }

    const courseEnrollmentData = await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: existingPayment.id },
        data: { isDeleted: true },
      });

      // paymentId is unique on CourseEnrollment (one payment -> at most one
      // enrollment), so this is a safe unique lookup.
      const enrollment = await tx.courseEnrollment.findUnique({
        where: { paymentId: existingPayment.id },
      });

      if (!enrollment) {
        return null;
      }

      return tx.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { isDeleted: true },
      });
    });

    return courseEnrollmentData;

    //
  }

  //
};

//
export const paymentServices = {
  successfullyPayment,
  failPayment,
};

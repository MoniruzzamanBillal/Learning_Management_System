import httpStatus from "http-status";
import AppError from "../Error/AppError";
import { courseEnrollmentModel } from "../modules/CourseEnrollment/CourseEnrollment.model";
import { PAYMENTSTATUS } from "../modules/payment/payment.constant";
import { paymentModel } from "../modules/payment/payment.model";
import catchAsync from "../util/catchAsync";

const ValidateCourseAccess = catchAsync(async (req, res, next) => {
  const userId = req?.user?.userId;
  const courseId = req?.params?.courseId;

  const enrollment = await courseEnrollmentModel.findOne({
    user: userId,
    course: courseId,
  });

  if (!enrollment) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You have not enrolled in this course!"
    );
  }

  const payment = await paymentModel.findOne({
    user: userId,
    course: courseId,
    paymentStatus: PAYMENTSTATUS.Completed,
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

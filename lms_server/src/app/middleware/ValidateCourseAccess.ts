import AppError from "../Error/AppError";
import catchAsync from "../util/catchAsync";
import httpStatus from "http-status";

const ValidateCourseAccess = catchAsync(async (req, res, next) => {
  const userId = req?.user?.userId;
  const courseId = req?.params?.id;

  console.log("user id in validate course access = ", userId);
  console.log("course id in validate course access = ", courseId);

  //   const enrollment = await courseEnrollmentModel.findOne({
  //     user: userId,
  //     course: courseId,
  //   });

  //   if (!enrollment) {
  //     throw new AppError(
  //       httpStatus.FORBIDDEN,
  //       "You have not enrolled in this course!"
  //     );
  //   }

  //   const payment = await paymentModel.findOne({
  //     user: userId,
  //     course: courseId,
  //     paymentStatus: "completed",
  //   });

  //   if (!payment) {
  //     throw new AppError(
  //       httpStatus.FORBIDDEN,
  //       "Payment is not completed for this course!"
  //     );
  //   }

  next();
});

export default ValidateCourseAccess;

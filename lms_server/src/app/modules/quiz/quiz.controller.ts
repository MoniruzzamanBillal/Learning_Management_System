import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { quizServices } from "./quiz.service";

// ! for creating a quiz for a module
const createQuiz = catchAsync(async (req, res) => {
  const result = await quizServices.createQuiz(
    req?.user?.userId as string,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Quiz created successfully !!!",
    data: result,
  });
});

// ! for the instructor/admin authoring view of a module's quiz
const getQuizForManage = catchAsync(async (req, res) => {
  const result = await quizServices.getQuizForManage(
    req?.params?.moduleId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz retrieved successfully !!!",
    data: result,
  });
});

// ! for updating a quiz
const updateQuiz = catchAsync(async (req, res) => {
  const result = await quizServices.updateQuiz(
    req?.params?.quizId as string,
    req?.user?.userId as string,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz updated successfully !!!",
    data: result,
  });
});

// ! for soft-deleting a quiz
const deleteQuiz = catchAsync(async (req, res) => {
  const result = await quizServices.deleteQuiz(
    req?.params?.quizId as string,
    req?.user?.userId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz deleted successfully !!!",
    data: result,
  });
});

// ! for a student opening a module's quiz
const getQuizToTake = catchAsync(async (req, res) => {
  const result = await quizServices.getQuizToTake(
    req?.user?.userId as string,
    req?.params?.courseId as string,
    req?.params?.moduleId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz retrieved successfully !!!",
    data: result,
  });
});

// ! for a student submitting a quiz
const submitQuiz = catchAsync(async (req, res) => {
  const result = await quizServices.submitQuiz(
    req?.user?.userId as string,
    req?.params?.courseId as string,
    req?.params?.quizId as string,
    req?.body?.answers,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Quiz submitted successfully !!!",
    data: result,
  });
});

//
export const quizController = {
  createQuiz,
  getQuizForManage,
  updateQuiz,
  deleteQuiz,
  getQuizToTake,
  submitQuiz,
};

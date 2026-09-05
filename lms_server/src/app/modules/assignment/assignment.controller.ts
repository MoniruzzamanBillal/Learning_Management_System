import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { assignmentServices } from "./assignment.service";

// ! for creating an assignment for a module
const createAssignment = catchAsync(async (req, res) => {
  const result = await assignmentServices.createAssignment(
    req?.user?.userId as string,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Assignment created successfully !!!",
    data: result,
  });
});

// ! for the instructor/admin authoring view of a module's assignment
const getAssignmentForManage = catchAsync(async (req, res) => {
  const result = await assignmentServices.getAssignmentForManage(
    req?.params?.moduleId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment retrieved successfully !!!",
    data: result,
  });
});

// ! for updating an assignment
const updateAssignment = catchAsync(async (req, res) => {
  const result = await assignmentServices.updateAssignment(
    req?.params?.assignmentId as string,
    req?.user?.userId as string,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment updated successfully !!!",
    data: result,
  });
});

// ! for soft-deleting an assignment
const deleteAssignment = catchAsync(async (req, res) => {
  const result = await assignmentServices.deleteAssignment(
    req?.params?.assignmentId as string,
    req?.user?.userId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment deleted successfully !!!",
    data: result,
  });
});

// ! for the instructor/admin grading list of an assignment's submissions
const getAssignmentSubmissions = catchAsync(async (req, res) => {
  const result = await assignmentServices.getAssignmentSubmissions(
    req?.params?.assignmentId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment submissions retrieved successfully !!!",
    data: result,
  });
});

// ! for a student opening a module's assignment
const getAssignmentToTake = catchAsync(async (req, res) => {
  const result = await assignmentServices.getAssignmentToTake(
    req?.user?.userId as string,
    req?.params?.courseId as string,
    req?.params?.moduleId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment retrieved successfully !!!",
    data: result,
  });
});

// ! for a student submitting/resubmitting an assignment
const submitAssignment = catchAsync(async (req, res) => {
  const result = await assignmentServices.submitAssignment(
    req?.user?.userId as string,
    req?.params?.courseId as string,
    req?.params?.assignmentId as string,
    req?.body?.content,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment submitted successfully !!!",
    data: result,
  });
});

// ! for an instructor grading a submission
const gradeSubmission = catchAsync(async (req, res) => {
  const result = await assignmentServices.gradeSubmission(
    req?.params?.submissionId as string,
    req?.user?.userId as string,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission graded successfully !!!",
    data: result,
  });
});

// ! for an instructor reopening a graded submission
const reopenSubmission = catchAsync(async (req, res) => {
  const result = await assignmentServices.reopenSubmission(
    req?.params?.submissionId as string,
    req?.user?.userId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission reopened successfully !!!",
    data: result,
  });
});

//
export const assignmentController = {
  createAssignment,
  getAssignmentForManage,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  getAssignmentToTake,
  submitAssignment,
  gradeSubmission,
  reopenSubmission,
};

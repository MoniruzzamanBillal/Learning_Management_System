import { startOfDay, subDays } from "date-fns";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import { paymentModel } from "../payment/payment.model";
import { UserRole } from "../user/user.constants";
import { userModel } from "../user/user.model";
import { TCourse } from "./course.interface";
import { courseModel } from "./course.model";

// ! for crating a course
const addCourse = async (payload: TCourse, file: any) => {
  const { instructors } = payload;

  if (file) {
    const name = (payload?.name as string).trim();
    const path = (file?.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(
      path as string,
      name as string,
    );

    const courseCover = cloudinaryResponse?.secure_url as string;
    payload.courseCover = courseCover;
  }

  await Promise.all(
    instructors?.map(async (instructor) => {
      const instructorData = await userModel.findById(instructor);

      if (!instructorData) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Instructor don't exist !!!",
        );
      }
    }),
  );

  const result = await courseModel.create(payload);

  return result;
};

// ! sort option -> mongo sort stage, used by getAllCourses
const courseSortMap: Record<string, Record<string, 1 | -1>> = {
  createdAt_desc: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating_desc: { averageRating: -1 },
};

// ! for getting all course data
const getAllCourses = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    category,
    limit = 10,
    page = 1,
    sortBy,
    minPrice,
    maxPrice,
  } = query;

  const params: Record<string, unknown> = {};

  params.published = true;

  if (category) {
    params.category = category;
  }

  if (searchTerm) {
    params.$or = [
      { name: { $regex: new RegExp(searchTerm as string, "i") } },
      { detail: { $regex: new RegExp(searchTerm as string, "i") } },
    ];
  }

  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    params.price = priceFilter;
  }

  const numaricLimit = Number(limit);
  const numaricPage = Number(page);
  const skip = (numaricPage - 1) * numaricLimit;

  const sortStage = courseSortMap[sortBy as string] ?? { createdAt: -1 };

  // console.log(params);

  const aggregatedCourses = await courseModel.aggregate([
    { $match: params },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "courseId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
        totalReviews: { $size: "$reviews" },
      },
    },
    { $sort: sortStage },
    { $skip: skip },
    { $limit: numaricLimit },
    {
      $addFields: {
        reviewData: {
          $cond: [
            { $eq: ["$totalReviews", 0] },
            "$$REMOVE",
            {
              averageRating: "$averageRating",
              totalReviews: "$totalReviews",
              _id: "$_id",
            },
          ],
        },
      },
    },
    {
      $project: {
        reviews: 0,
        averageRating: 0,
        totalReviews: 0,
        published: 0,
        createdAt: 0,
        __v: 0,
        description: 0,
        modules: 0,
        updatedAt: 0,
      },
    },
  ]);

  const result = await courseModel.populate(aggregatedCourses, {
    path: "instructors",
    select: "name",
  });

  const totalCourses = await courseModel.countDocuments({ published: true });

  return { data: result, meta: { totalCourses } };
};

// ! for getting all course data ,admin manage course
const getAllCoursesForAdmin = async () => {
  const result = await courseModel
    .find()
    .populate("instructors", " name email profilePicture _id ");
  return result;
};

// ! for getting all course data with module ( admin and instructor )
const getAllCoursesWithModules = async () => {
  const result = await courseModel
    .find()
    .populate("instructors", " name email profilePicture _id ")
    .populate("modules", " -__v -updatedAt -createdAt ");
  return result;
};

// ! for getting instructor assign courses
const getInstructorsAssignCourses = async (instructorId: string) => {
  const courseData = await courseModel
    .find({ instructors: instructorId })
    .select(" category courseCover name _id published ");

  if (!courseData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Instructor don't assigned for any courses  !!!",
    );
  }

  return courseData;
};

// ! for getting single course data
const getSingleCoureData = async (courseId: string) => {
  const result = await courseModel
    .findOne({ _id: courseId, published: true })
    .populate("instructors", " name  _id ")
    .select(" -published -__v -createdAt ");

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return result;
};

// ! for getting single course data , admin manage course
const getCourseDetailsForAdmin = async (courseId: string) => {
  const result = await courseModel
    .findOne({ _id: courseId })
    .populate("instructors", " name email profilePicture _id ")
    .populate("modules", "_id course title videos instructor ");

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return result;
};

// ! course detail for instructor
const getCourseDetailForInstructor = async (courseId: string) => {
  const result = await courseModel
    .findOne({ _id: courseId })
    .select(" _id name category published modules ");
  // .populate("instructors", " name email profilePicture _id ");

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return result;
};

// ! for updating course data
const updateCourseData = async (
  payload: Partial<TCourse>,
  file: any,
  courseId: string,
) => {
  const courseData = await courseModel.findById(courseId);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  if (file) {
    const name = (payload?.name as string).trim();
    const path = (file?.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(
      path as string,
      name as string,
    );

    const courseCover = cloudinaryResponse?.secure_url as string;
    payload.courseCover = courseCover;
  }

  const updatedResult = await courseModel.findByIdAndUpdate(courseId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedResult;
};

// ! for publishing a course
const publishCourse = async (courseId: string) => {
  const courseData = await courseModel.findById(courseId);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  if (courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Course is already published !!!",
    );
  }

  const result = await courseModel.findByIdAndUpdate(
    courseId,
    { published: true },
    { new: true },
  );

  return result;
};

// ! admin stat
const adminStatistics = async () => {
  const totalCourses = await courseModel.countDocuments();

  const totalStudents = await userModel.countDocuments({
    userRole: UserRole.user,
  });

  const totalInstructors = await userModel.countDocuments({
    userRole: UserRole.instructor,
  });

  const publishedCourses = await courseModel.countDocuments({
    published: true,
  });

  const thirtyDaysAgo = subDays(startOfDay(new Date()), 30);

  const revenueLast30Day = await paymentModel.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
    //
  ]);

  const result = {
    totalCourses,
    totalStudents,
    totalInstructors,
    publishedCourses,
    revenue: revenueLast30Day[0]?.total || 0,
  };

  return result;

  //
};

//
export const courseServices = {
  addCourse,
  getAllCourses,
  getSingleCoureData,
  updateCourseData,
  publishCourse,
  getCourseDetailsForAdmin,
  getAllCoursesForAdmin,
  getInstructorsAssignCourses,
  getAllCoursesWithModules,
  getCourseDetailForInstructor,
  adminStatistics,
};

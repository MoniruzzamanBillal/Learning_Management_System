import { Prisma } from "../../../generated/prisma/client";
import { startOfDay, subDays } from "date-fns";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import prisma from "../../util/prisma";
import { PAYMENTSTATUS } from "../payment/payment.constant";
import { UserRole } from "../user/user.constants";
import { videoProgressStatus } from "../VideoProgress/VideoProgress.constants";

type TAddCoursePayload = {
  name: string;
  description: string;
  price: number;
  category: string;
  courseCover?: string;
  instructors?: string[];
};

// ! for crating a course
const addCourse = async (
  payload: TAddCoursePayload,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any
) => {
  const { instructors } = payload;

  if (file) {
    const name = (payload?.name as string).trim();
    const path = (file?.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(
      path as string,
      name as string
    );

    const courseCover = cloudinaryResponse?.secure_url as string;
    payload.courseCover = courseCover;
  }

  if (instructors?.length) {
    await Promise.all(
      instructors.map(async (instructor) => {
        const instructorData = await prisma.user.findFirst({
          where: { id: instructor, isDeleted: false },
        });

        if (!instructorData) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Instructor don't exist !!!"
          );
        }
      })
    );
  }

  const result = await prisma.course.create({
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      courseCover: payload.courseCover,
      instructors: instructors?.length
        ? { create: instructors.map((userId) => ({ userId })) }
        : undefined,
    },
    include: {
      instructors: {
        include: { instructor: { select: { id: true, name: true } } },
      },
    },
  });

  return result;
};

// ! sort option -> Prisma orderBy, used by getAllCourses (rating_desc is
// handled separately below since it's a computed aggregate, not a column)
const courseOrderByMap: Record<string, Prisma.CourseOrderByWithRelationInput> = {
  createdAt_desc: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
};

const courseListSelect = {
  id: true,
  name: true,
  price: true,
  category: true,
  courseCover: true,
  aiReviewSummary: true,
  aiReviewSummaryReviewCount: true,
  instructors: {
    select: { instructor: { select: { id: true, name: true } } },
  },
  reviews: { select: { rating: true } },
} satisfies Prisma.CourseSelect;

type TCourseListRow = Prisma.CourseGetPayload<{ select: typeof courseListSelect }>;

// ! shapes a raw course+reviews row into the public list-item shape (mirrors
// the old $lookup/$addFields/$project aggregation pipeline stages)
const shapeCourseListItem = (course: TCourseListRow) => {
  const { instructors, reviews, ...rest } = course;
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  return {
    ...rest,
    instructors: instructors.map((ci) => ci.instructor),
    ...(totalReviews > 0
      ? { reviewData: { averageRating, totalReviews, id: rest.id } }
      : {}),
  };
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

  const numaricLimit = Number(limit);
  const numaricPage = Number(page);
  const skip = (numaricPage - 1) * numaricLimit;

  const where: Prisma.CourseWhereInput = { published: true };

  if (category) {
    where.category = category as string;
  }

  if (searchTerm) {
    // Original also matched a nonexistent `detail` field via Mongo $regex,
    // which was always a no-op (no course document ever had that field) —
    // dropped here since there's no equivalent column to replicate a no-op
    // against; functionally identical to the original.
    where.name = { contains: searchTerm as string, mode: "insensitive" };
  }

  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {}),
    };
  }

  if (sortBy === "rating_desc") {
    // averageRating is a computed aggregate, not a column — Prisma can't
    // order by it directly, so fetch every match and sort/paginate in JS.
    const all = await prisma.course.findMany({ where, select: courseListSelect });
    const totalCourses = all.length;
    const shaped = all
      .map(shapeCourseListItem)
      .sort(
        (a, b) =>
          (b.reviewData?.averageRating ?? 0) - (a.reviewData?.averageRating ?? 0)
      );
    return {
      data: shaped.slice(skip, skip + numaricLimit),
      meta: { totalCourses },
    };
  }

  const orderBy = courseOrderByMap[sortBy as string] ?? { createdAt: "desc" };

  // Built from the same shared `where` so the paginated results and the
  // count always agree — fixes the pre-existing mismatch bug where the two
  // queries could use inconsistent filters.
  const [rows, totalCourses] = await Promise.all([
    prisma.course.findMany({ where, select: courseListSelect, orderBy, skip, take: numaricLimit }),
    prisma.course.count({ where }),
  ]);

  return { data: rows.map(shapeCourseListItem), meta: { totalCourses } };
};

// ! for getting all course data ,admin manage course
const getAllCoursesForAdmin = async () => {
  const courses = await prisma.course.findMany({
    include: {
      instructors: {
        include: {
          instructor: {
            select: { id: true, name: true, email: true, profilePicture: true },
          },
        },
      },
    },
  });

  return courses.map((course) => ({
    ...course,
    instructors: course.instructors.map((ci) => ci.instructor),
  }));
};

// ! for getting all course data with module ( admin and instructor )
const getAllCoursesWithModules = async () => {
  const courses = await prisma.course.findMany({
    include: {
      instructors: {
        include: {
          instructor: {
            select: { id: true, name: true, email: true, profilePicture: true },
          },
        },
      },
      modules: {
        select: {
          id: true,
          courseId: true,
          instructorId: true,
          title: true,
          isDeleted: true,
          videos: { select: { id: true } },
        },
      },
    },
  });

  return courses.map((course) => ({
    ...course,
    instructors: course.instructors.map((ci) => ci.instructor),
    modules: course.modules.map((m) => ({ ...m, videos: m.videos.map((v) => v.id) })),
  }));
};

// ! for getting instructor assign courses
const getInstructorsAssignCourses = async (instructorId: string) => {
  const courseData = await prisma.course.findMany({
    where: { instructors: { some: { userId: instructorId } } },
    select: {
      id: true,
      category: true,
      courseCover: true,
      name: true,
      published: true,
    },
  });

  return courseData;
};

// ! for getting single course data
const getSingleCoureData = async (courseId: string) => {
  // findFirst, not findUnique: combining the unique `id` lookup with
  // `published: true` isn't allowed on findUnique.
  const result = await prisma.course.findFirst({
    where: { id: courseId, published: true },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      courseCover: true,
      aiReviewSummary: true,
      aiReviewSummaryReviewCount: true,
      updatedAt: true,
      instructors: {
        select: { instructor: { select: { id: true, name: true } } },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return {
    ...result,
    instructors: result.instructors.map((ci) => ci.instructor),
  };
};

// ! for getting single course data , admin manage course
const getCourseDetailsForAdmin = async (courseId: string) => {
  const result = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructors: {
        include: {
          instructor: {
            select: { id: true, name: true, email: true, profilePicture: true },
          },
        },
      },
      modules: {
        select: {
          id: true,
          courseId: true,
          title: true,
          instructorId: true,
          videos: { select: { id: true } },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return {
    ...result,
    instructors: result.instructors.map((ci) => ci.instructor),
    modules: result.modules.map((m) => ({ ...m, videos: m.videos.map((v) => v.id) })),
  };
};

// ! course detail for instructor
const getCourseDetailForInstructor = async (courseId: string) => {
  const result = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      name: true,
      category: true,
      published: true,
      modules: { select: { id: true } },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return { ...result, modules: result.modules.map((m) => m.id) };
};

// ! for updating course data
const updateCourseData = async (
  payload: Partial<TAddCoursePayload>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
  courseId: string
) => {
  const courseData = await prisma.course.findUnique({ where: { id: courseId } });

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  if (file) {
    const name = (payload?.name as string).trim();
    const path = (file?.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(
      path as string,
      name as string
    );

    const courseCover = cloudinaryResponse?.secure_url as string;
    payload.courseCover = courseCover;
  }

  // `instructors` isn't part of the update validation schema — never present
  // on this payload — so no join-table manipulation is needed here; only
  // scalar fields are passed through (undefined ones are simply skipped by
  // Prisma, matching partial-update semantics).
  const updatedResult = await prisma.course.update({
    where: { id: courseId },
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      courseCover: payload.courseCover,
    },
  });

  return updatedResult;
};

// ! for publishing a course
const publishCourse = async (courseId: string) => {
  const courseData = await prisma.course.findUnique({ where: { id: courseId } });

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  if (courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Course is already published !!!"
    );
  }

  const result = await prisma.course.update({
    where: { id: courseId },
    data: { published: true },
  });

  return result;
};

// ! admin stat
const adminStatistics = async () => {
  const totalCourses = await prisma.course.count();

  // Matches original behavior exactly: Mongoose's countDocuments() bypassed
  // the isDeleted pre-find hook (only "find"/"findOne" were hooked), so
  // these never filtered out soft-deleted users either — not a fix, just
  // faithful parity.
  const totalStudents = await prisma.user.count({
    where: { userRole: UserRole.user },
  });

  const totalInstructors = await prisma.user.count({
    where: { userRole: UserRole.instructor },
  });

  const publishedCourses = await prisma.course.count({
    where: { published: true },
  });

  const thirtyDaysAgo = subDays(startOfDay(new Date()), 30);

  const revenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      createdAt: { gte: thirtyDaysAgo },
      paymentStatus: PAYMENTSTATUS.Completed,
    },
  });

  const revenueOverTime = await prisma.$queryRaw<
    { date: string; total: number }[]
  >`
    SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as date,
           COALESCE(SUM("amount"), 0)::float as total
    FROM "Payment"
    WHERE "createdAt" >= ${thirtyDaysAgo} AND "paymentStatus" = 'Completed'
    GROUP BY date
    ORDER BY date ASC;
  `;

  const enrollmentsOverTime = await prisma.$queryRaw<
    { date: string; count: number }[]
  >`
    SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as date,
           COUNT(*)::int as count
    FROM "CourseEnrollment"
    WHERE "createdAt" >= ${thirtyDaysAgo} AND "isDeleted" = false
    GROUP BY date
    ORDER BY date ASC;
  `;

  // Per-(user,course) watched/total ratio, averaged across all pairs —
  // mirrors the old Mongo $group/$cond aggregation. Done as two groupBys +
  // a JS merge/average since Prisma's groupBy can't express a conditional
  // sum without falling back to $queryRaw, and this dataset is small enough
  // that JS aggregation is simple and safe.
  const totalsByPair = await prisma.videoProgress.groupBy({
    by: ["userId", "courseId"],
    _count: { _all: true },
  });

  const watchedByPair = await prisma.videoProgress.groupBy({
    by: ["userId", "courseId"],
    where: { videoStatus: videoProgressStatus.watched },
    _count: { _all: true },
  });

  const watchedMap = new Map(
    watchedByPair.map((row) => [`${row.userId}:${row.courseId}`, row._count._all])
  );

  const completionPercentages = totalsByPair.map((row) => {
    const key = `${row.userId}:${row.courseId}`;
    const watched = watchedMap.get(key) ?? 0;
    const total = row._count._all;
    return total === 0 ? 0 : (watched / total) * 100;
  });

  const averageCompletion = completionPercentages.length
    ? completionPercentages.reduce((sum, pct) => sum + pct, 0) /
      completionPercentages.length
    : 0;

  const result = {
    totalCourses,
    totalStudents,
    totalInstructors,
    publishedCourses,
    revenue: Number(revenueAgg._sum.amount) || 0,
    revenueOverTime,
    enrollmentsOverTime,
    averageCompletion: Math.round(averageCompletion || 0),
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

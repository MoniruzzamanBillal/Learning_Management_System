"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseServices = void 0;
const date_fns_1 = require("date-fns");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const prisma_1 = __importDefault(require("../../util/prisma"));
const payment_constant_1 = require("../payment/payment.constant");
const user_constants_1 = require("../user/user.constants");
const VideoProgress_constants_1 = require("../VideoProgress/VideoProgress.constants");
// ! for crating a course
const addCourse = (payload, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
file) => __awaiter(void 0, void 0, void 0, function* () {
    const { instructors } = payload;
    if (file) {
        const name = (payload === null || payload === void 0 ? void 0 : payload.name).trim();
        const path = (file === null || file === void 0 ? void 0 : file.path).trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        const courseCover = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
        payload.courseCover = courseCover;
    }
    if (instructors === null || instructors === void 0 ? void 0 : instructors.length) {
        yield Promise.all(instructors.map((instructor) => __awaiter(void 0, void 0, void 0, function* () {
            const instructorData = yield prisma_1.default.user.findFirst({
                where: { id: instructor, isDeleted: false },
            });
            if (!instructorData) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Instructor don't exist !!!");
            }
        })));
    }
    const result = yield prisma_1.default.course.create({
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            category: payload.category,
            courseCover: payload.courseCover,
            instructors: (instructors === null || instructors === void 0 ? void 0 : instructors.length)
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
});
// ! sort option -> Prisma orderBy, used by getAllCourses (rating_desc is
// handled separately below since it's a computed aggregate, not a column)
const courseOrderByMap = {
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
};
// ! shapes a raw course+reviews row into the public list-item shape (mirrors
// the old $lookup/$addFields/$project aggregation pipeline stages)
const shapeCourseListItem = (course) => {
    const { instructors, reviews } = course, rest = __rest(course, ["instructors", "reviews"]);
    const totalReviews = reviews.length;
    const averageRating = totalReviews
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
    return Object.assign(Object.assign(Object.assign({}, rest), { instructors: instructors.map((ci) => ci.instructor) }), (totalReviews > 0
        ? { reviewData: { averageRating, totalReviews, id: rest.id } }
        : {}));
};
// ! for getting all course data
const getAllCourses = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchTerm, category, limit = 10, page = 1, sortBy, minPrice, maxPrice, } = query;
    const numaricLimit = Number(limit);
    const numaricPage = Number(page);
    const skip = (numaricPage - 1) * numaricLimit;
    const where = { published: true };
    if (category) {
        where.category = category;
    }
    if (searchTerm) {
        // Original also matched a nonexistent `detail` field via Mongo $regex,
        // which was always a no-op (no course document ever had that field) —
        // dropped here since there's no equivalent column to replicate a no-op
        // against; functionally identical to the original.
        where.name = { contains: searchTerm, mode: "insensitive" };
    }
    if (minPrice || maxPrice) {
        where.price = Object.assign(Object.assign({}, (minPrice ? { gte: Number(minPrice) } : {})), (maxPrice ? { lte: Number(maxPrice) } : {}));
    }
    if (sortBy === "rating_desc") {
        // averageRating is a computed aggregate, not a column — Prisma can't
        // order by it directly, so fetch every match and sort/paginate in JS.
        const all = yield prisma_1.default.course.findMany({ where, select: courseListSelect });
        const totalCourses = all.length;
        const shaped = all
            .map(shapeCourseListItem)
            .sort((a, b) => { var _a, _b, _c, _d; return ((_b = (_a = b.reviewData) === null || _a === void 0 ? void 0 : _a.averageRating) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = a.reviewData) === null || _c === void 0 ? void 0 : _c.averageRating) !== null && _d !== void 0 ? _d : 0); });
        return {
            data: shaped.slice(skip, skip + numaricLimit),
            meta: { totalCourses },
        };
    }
    const orderBy = (_a = courseOrderByMap[sortBy]) !== null && _a !== void 0 ? _a : { createdAt: "desc" };
    // Built from the same shared `where` so the paginated results and the
    // count always agree — fixes the pre-existing mismatch bug where the two
    // queries could use inconsistent filters.
    const [rows, totalCourses] = yield Promise.all([
        prisma_1.default.course.findMany({ where, select: courseListSelect, orderBy, skip, take: numaricLimit }),
        prisma_1.default.course.count({ where }),
    ]);
    return { data: rows.map(shapeCourseListItem), meta: { totalCourses } };
});
// ! for getting all course data ,admin manage course
const getAllCoursesForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield prisma_1.default.course.findMany({
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
    return courses.map((course) => (Object.assign(Object.assign({}, course), { instructors: course.instructors.map((ci) => ci.instructor) })));
});
// ! for getting all course data with module ( admin and instructor )
const getAllCoursesWithModules = () => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield prisma_1.default.course.findMany({
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
    return courses.map((course) => (Object.assign(Object.assign({}, course), { instructors: course.instructors.map((ci) => ci.instructor), modules: course.modules.map((m) => (Object.assign(Object.assign({}, m), { videos: m.videos.map((v) => v.id) }))) })));
});
// ! for getting instructor assign courses
const getInstructorsAssignCourses = (instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield prisma_1.default.course.findMany({
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
});
// ! for getting single course data
const getSingleCoureData = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    // findFirst, not findUnique: combining the unique `id` lookup with
    // `published: true` isn't allowed on findUnique.
    const result = yield prisma_1.default.course.findFirst({
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
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    return Object.assign(Object.assign({}, result), { instructors: result.instructors.map((ci) => ci.instructor) });
});
// ! for getting single course data , admin manage course
const getCourseDetailsForAdmin = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.course.findUnique({
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
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    return Object.assign(Object.assign({}, result), { instructors: result.instructors.map((ci) => ci.instructor), modules: result.modules.map((m) => (Object.assign(Object.assign({}, m), { videos: m.videos.map((v) => v.id) }))) });
});
// ! course detail for instructor
const getCourseDetailForInstructor = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.course.findUnique({
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
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    return Object.assign(Object.assign({}, result), { modules: result.modules.map((m) => m.id) });
});
// ! for updating course data
const updateCourseData = (payload, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
file, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield prisma_1.default.course.findUnique({ where: { id: courseId } });
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    if (file) {
        const name = (payload === null || payload === void 0 ? void 0 : payload.name).trim();
        const path = (file === null || file === void 0 ? void 0 : file.path).trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        const courseCover = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
        payload.courseCover = courseCover;
    }
    // `instructors` isn't part of the update validation schema — never present
    // on this payload — so no join-table manipulation is needed here; only
    // scalar fields are passed through (undefined ones are simply skipped by
    // Prisma, matching partial-update semantics).
    const updatedResult = yield prisma_1.default.course.update({
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
});
// ! for publishing a course
const publishCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield prisma_1.default.course.findUnique({ where: { id: courseId } });
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    if (courseData === null || courseData === void 0 ? void 0 : courseData.published) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course is already published !!!");
    }
    const result = yield prisma_1.default.course.update({
        where: { id: courseId },
        data: { published: true },
    });
    return result;
});
// ! admin stat
const adminStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalCourses = yield prisma_1.default.course.count();
    // Matches original behavior exactly: Mongoose's countDocuments() bypassed
    // the isDeleted pre-find hook (only "find"/"findOne" were hooked), so
    // these never filtered out soft-deleted users either — not a fix, just
    // faithful parity.
    const totalStudents = yield prisma_1.default.user.count({
        where: { userRole: user_constants_1.UserRole.user },
    });
    const totalInstructors = yield prisma_1.default.user.count({
        where: { userRole: user_constants_1.UserRole.instructor },
    });
    const publishedCourses = yield prisma_1.default.course.count({
        where: { published: true },
    });
    const thirtyDaysAgo = (0, date_fns_1.subDays)((0, date_fns_1.startOfDay)(new Date()), 30);
    const revenueAgg = yield prisma_1.default.payment.aggregate({
        _sum: { amount: true },
        where: {
            createdAt: { gte: thirtyDaysAgo },
            paymentStatus: payment_constant_1.PAYMENTSTATUS.Completed,
        },
    });
    const revenueOverTime = yield prisma_1.default.$queryRaw `
    SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as date,
           COALESCE(SUM("amount"), 0)::float as total
    FROM "Payment"
    WHERE "createdAt" >= ${thirtyDaysAgo} AND "paymentStatus" = 'Completed'
    GROUP BY date
    ORDER BY date ASC;
  `;
    const enrollmentsOverTime = yield prisma_1.default.$queryRaw `
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
    const totalsByPair = yield prisma_1.default.videoProgress.groupBy({
        by: ["userId", "courseId"],
        _count: { _all: true },
    });
    const watchedByPair = yield prisma_1.default.videoProgress.groupBy({
        by: ["userId", "courseId"],
        where: { videoStatus: VideoProgress_constants_1.videoProgressStatus.watched },
        _count: { _all: true },
    });
    const watchedMap = new Map(watchedByPair.map((row) => [`${row.userId}:${row.courseId}`, row._count._all]));
    const completionPercentages = totalsByPair.map((row) => {
        var _a;
        const key = `${row.userId}:${row.courseId}`;
        const watched = (_a = watchedMap.get(key)) !== null && _a !== void 0 ? _a : 0;
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
});
//
exports.courseServices = {
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

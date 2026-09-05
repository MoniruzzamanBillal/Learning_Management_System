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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
// ! for crating a module
const addModule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { course, instructor } = payload;
    const courseData = yield prisma_1.default.course.findUnique({ where: { id: course } });
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    if (courseData === null || courseData === void 0 ? void 0 : courseData.published) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course is already published , you can't add new module !!!!");
    }
    // instructorId is a required FK on Module (fixes the old TModule.instructor
    // typing bug where it was incorrectly an optional array — the Mongoose
    // schema itself already enforced a single required instructor at runtime,
    // only the TS interface lied). Validation still allows `instructor` to be
    // omitted, so this check preserves the original's exact error behavior
    // rather than letting Prisma throw an unrelated FK/validation error.
    const instructorData = instructor
        ? yield prisma_1.default.user.findFirst({ where: { id: instructor, isDeleted: false } })
        : null;
    if (!instructorData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This instructor don't exist !!!");
    }
    // No denormalized Course.modules array to push into anymore — Module is
    // derived automatically via Module.courseId, so this is a single write
    // (the old Mongoose transaction existed only to keep that array in sync).
    const moduleData = yield prisma_1.default.module.create({
        data: {
            title: payload.title,
            courseId: course,
            instructorId: instructor,
        },
    });
    return moduleData;
});
// ! for getting all module
const getAllModuleData = () => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield prisma_1.default.module.findMany({
        where: { isDeleted: false },
        include: {
            course: { select: { id: true, name: true, published: true } },
            videos: { where: { isDeleted: false }, select: { id: true } },
        },
    });
    return moduleData.map((module) => (Object.assign(Object.assign({}, module), { videos: module.videos.map((video) => video.id) })));
});
// ! get module data based on course id
const getModuleFromCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = yield prisma_1.default.course.findUnique({ where: { id: courseId } });
    if (!courseData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Course don't exist!!!");
    }
    const result = yield prisma_1.default.module.findMany({
        where: { courseId, isDeleted: false },
        include: {
            course: { select: { id: true, name: true, published: true } },
            videos: { where: { isDeleted: false }, select: { id: true } },
        },
    });
    return result.map((module) => (Object.assign(Object.assign({}, module), { videos: module.videos.map((video) => video.id) })));
});
// ! for getting module data
const getModulData = (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    // findFirst, not findUnique: combining the unique `id` lookup with
    // `isDeleted: false` isn't allowed on findUnique.
    const moduleData = yield prisma_1.default.module.findFirst({
        where: { id: moduleId, isDeleted: false },
        include: {
            course: {
                select: { id: true, name: true, description: true, category: true, published: true },
            },
            videos: {
                where: { isDeleted: false },
                select: { id: true, title: true, videoUrl: true },
            },
            instructor: {
                select: { id: true, name: true, email: true, profilePicture: true },
            },
        },
    });
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module don't exist !!!");
    }
    return moduleData;
});
// ! for updating module
const updateModule = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
payload, moduleId, instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleData = yield prisma_1.default.module.findFirst({
        where: { id: moduleId, isDeleted: false },
    });
    if (!moduleData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This module don't exist !!!");
    }
    if (moduleData.instructorId !== instructorId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to update this module !!!");
    }
    const updatedData = yield prisma_1.default.module.update({
        where: { id: moduleId },
        data: payload,
    });
    return updatedData;
});
//
exports.moduleServices = {
    addModule,
    getModulData,
    updateModule,
    getAllModuleData,
    getModuleFromCourseId,
};

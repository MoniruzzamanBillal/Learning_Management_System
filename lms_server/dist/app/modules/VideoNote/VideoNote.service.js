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
exports.videoNoteServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
// ! for getting the caller's own note for a video
const getMyVideoNote = (userId, videoId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.videoNote.findFirst({
        where: { userId, videoId, isDeleted: false },
    });
    return result;
});
// ! for creating/updating the caller's note for a video
const upsertVideoNote = (userId, videoId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const video = yield prisma_1.default.video.findFirst({
        where: { id: videoId, isDeleted: false },
        select: { moduleId: true, module: { select: { courseId: true } } },
    });
    if (!video) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Video not found !!!");
    }
    const result = yield prisma_1.default.videoNote.upsert({
        where: { userId_videoId: { userId, videoId } },
        create: {
            userId,
            videoId,
            courseId: video.module.courseId,
            moduleId: video.moduleId,
            content,
        },
        update: { content, isDeleted: false },
    });
    return result;
});
// ! for soft-deleting the caller's note for a video
const deleteVideoNote = (userId, videoId) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield prisma_1.default.videoNote.findFirst({
        where: { userId, videoId, isDeleted: false },
    });
    if (!note) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Note not found !!!");
    }
    const result = yield prisma_1.default.videoNote.update({
        where: { id: note.id },
        data: { isDeleted: true },
    });
    return result;
});
//
exports.videoNoteServices = {
    getMyVideoNote,
    upsertVideoNote,
    deleteVideoNote,
};

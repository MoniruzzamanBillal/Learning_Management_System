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
exports.errorLogServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
// ! for storing an error, called internally from globalErrorHandler only
const logError = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.errorLog.create({
            data: Object.assign(Object.assign({}, payload), { errorSources: payload.errorSources }),
        });
    }
    catch (error) {
        console.error("Failed to persist error log:", error);
    }
});
// ! for getting all error logs (admin only)
const getAllErrorLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.errorLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { user: { select: { name: true, email: true } } },
    });
    return result;
});
// ! for getting a single error log's detail (admin only)
const getErrorLogById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.errorLog.findUnique({ where: { id } });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This error log doesn't exist!!!");
    }
    return result;
});
// ! for deleting error logs older than 30 days — replaces the Mongo TTL
// index, which has no Postgres/Prisma equivalent. Called from the Vercel
// Cron route only (see errorLog.route.ts).
const cleanupOldErrorLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = yield prisma_1.default.errorLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
    });
    return { deletedCount: result.count };
});
exports.errorLogServices = {
    logError,
    getAllErrorLogs,
    getErrorLogById,
    cleanupOldErrorLogs,
};

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
        include: { user: { select: { id: true, name: true, email: true } } },
    });
    // Reshapes `user` into the `userId` key, matching the original Mongoose
    // `.populate("userId", "name email")`'s in-place-replacement behavior —
    // keeps the frontend contract (`userId: {id, name, email} | null`)
    // unchanged by this migration.
    return result.map((_a) => {
        var { user } = _a, rest = __rest(_a, ["user"]);
        return (Object.assign(Object.assign({}, rest), { userId: user }));
    });
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

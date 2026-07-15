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
const errorLog_model_1 = require("./errorLog.model");
// ! for storing an error, called internally from globalErrorHandler only
const logError = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield errorLog_model_1.errorLogModel.create(payload);
    }
    catch (error) {
        console.error("Failed to persist error log:", error);
    }
});
// ! for getting all error logs (admin only)
const getAllErrorLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield errorLog_model_1.errorLogModel
        .find()
        .sort({ createdAt: -1 })
        .limit(200)
        .populate("userId", "name email");
    return result;
});
// ! for getting a single error log's detail (admin only)
const getErrorLogById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield errorLog_model_1.errorLogModel.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This error log doesn't exist!!!");
    }
    return result;
});
exports.errorLogServices = {
    logError,
    getAllErrorLogs,
    getErrorLogById,
};

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
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../Error/AppError"));
const handleCatError_1 = require("../Error/handleCatError");
const handleDuplicateError_1 = require("../Error/handleDuplicateError");
const handleValidationError_1 = require("../Error/handleValidationError");
const handleZodError_1 = require("../Error/handleZodError");
const errorLog_service_1 = require("../modules/errorLog/errorLog.service");
const globalErrorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let status = error.status || 500;
    let message = error.message || "Something went wrong!!";
    let errorSources = [
        {
            path: "",
            message: "",
        },
    ];
    // ! zod validation error
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.handleZodError)(error);
        status = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    // ! mongoose validation error
    else if ((error === null || error === void 0 ? void 0 : error.name) === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(error);
        status = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    // ! cast error
    if ((error === null || error === void 0 ? void 0 : error.name) === "CastError") {
        const simplifiedError = (0, handleCatError_1.handleCastError)(error);
        status = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    // ! handle duplicate error
    else if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(error);
        status = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    // ! handle custom app error
    else if (error instanceof AppError_1.default) {
        status = error === null || error === void 0 ? void 0 : error.status;
        message = error === null || error === void 0 ? void 0 : error.message;
        errorSources = [{ path: "", message: error === null || error === void 0 ? void 0 : error.message }];
    }
    yield errorLog_service_1.errorLogServices.logError({
        message,
        statusCode: status,
        errorSources,
        stack: error === null || error === void 0 ? void 0 : error.stack,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        userRole: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userRole,
    });
    return res.status(status).json({
        success: false,
        message,
        errorSources,
        stack: error === null || error === void 0 ? void 0 : error.stack,
    });
});
exports.default = globalErrorHandler;

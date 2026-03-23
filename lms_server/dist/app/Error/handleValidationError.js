"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const http_status_1 = __importDefault(require("http-status"));
const handleValidationError = (error) => {
    const errorSources = Object.values(error === null || error === void 0 ? void 0 : error.errors).map((value) => {
        return {
            path: value === null || value === void 0 ? void 0 : value.path,
            message: value === null || value === void 0 ? void 0 : value.message,
        };
    });
    const statusCode = http_status_1.default.BAD_REQUEST;
    return {
        statusCode,
        message: "mongoose ValidationError",
        errorSources,
    };
};
exports.handleValidationError = handleValidationError;

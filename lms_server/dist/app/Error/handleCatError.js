"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const http_status_1 = __importDefault(require("http-status"));
const handleCastError = (error) => {
    const errorSources = [
        {
            path: error === null || error === void 0 ? void 0 : error.path,
            message: error === null || error === void 0 ? void 0 : error.message,
        },
    ];
    const statusCode = http_status_1.default.NOT_FOUND;
    return {
        statusCode,
        message: "Invalid Id ",
        errorSources,
    };
};
exports.handleCastError = handleCastError;

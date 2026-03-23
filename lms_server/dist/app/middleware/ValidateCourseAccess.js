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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../Error/AppError"));
const CourseEnrollment_model_1 = require("../modules/CourseEnrollment/CourseEnrollment.model");
const payment_constant_1 = require("../modules/payment/payment.constant");
const payment_model_1 = require("../modules/payment/payment.model");
const catchAsync_1 = __importDefault(require("../util/catchAsync"));
const ValidateCourseAccess = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const courseId = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.courseId;
    const enrollment = yield CourseEnrollment_model_1.courseEnrollmentModel.findOne({
        user: userId,
        course: courseId,
    });
    if (!enrollment) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You have not enrolled in this course!");
    }
    const payment = yield payment_model_1.paymentModel.findOne({
        user: userId,
        course: courseId,
        paymentStatus: payment_constant_1.PAYMENTSTATUS.Completed,
    });
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Payment is not completed for this course!");
    }
    next();
}));
exports.default = ValidateCourseAccess;

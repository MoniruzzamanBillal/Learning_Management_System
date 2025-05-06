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
exports.paymentServices = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const CourseEnrollment_model_1 = require("../CourseEnrollment/CourseEnrollment.model");
const payment_constant_1 = require("./payment.constant");
const payment_model_1 = require("./payment.model");
// ! for validating payment
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload || !(payload === null || payload === void 0 ? void 0 : payload.status) || !((payload === null || payload === void 0 ? void 0 : payload.status) === "VALID")) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid Payment ");
    }
    const response = yield (0, axios_1.default)({
        method: "GET",
        url: `${config_1.default.SSL_VALIDATION_URL}?val_id=${payload === null || payload === void 0 ? void 0 : payload.val_id}&store_id=${config_1.default.STORE_ID}&store_passwd=${config_1.default.STORE_PASSWORD}&format=json`,
    });
    if (!(response === null || response === void 0 ? void 0 : response.status) === "VALID ") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment Failed !!!");
    }
    const transactionId = response === null || response === void 0 ? void 0 : response.tran_id;
    const result = yield payment_model_1.paymentModel.findOneAndUpdate({ transactionId }, { paymentStatus: payment_constant_1.PAYMENTSTATUS.Completed }, { new: true });
    return result;
    //
});
// ! after successfully payment
const successfullyPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id, status } = payload;
    if (status !== "VALID") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment Failed !!!");
    }
    const updatedPaymentResult = yield payment_model_1.paymentModel.findOneAndUpdate({ transactionId: tran_id }, { paymentStatus: payment_constant_1.PAYMENTSTATUS.Completed }, { new: true, runValidators: true });
    return updatedPaymentResult;
    //
});
// ! for fail paymnet
const failPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id, status } = payload;
    if (status === "FAILED") {
        //
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const updatedPaymentData = yield payment_model_1.paymentModel.findOneAndUpdate({ transactionId: tran_id, paymentStatus: payment_constant_1.PAYMENTSTATUS.Pending }, { isDeleted: true }, { new: true, runValidators: true, session });
            const courseEnrollmentData = yield CourseEnrollment_model_1.courseEnrollmentModel.findOneAndUpdate({ Payment: updatedPaymentData === null || updatedPaymentData === void 0 ? void 0 : updatedPaymentData._id }, { isDeleted: true }, { new: true, runValidators: true, session });
            yield session.commitTransaction();
            yield session.endSession();
            return courseEnrollmentData;
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            console.log(error);
            throw new Error(error);
        }
        //
    }
    //
});
//
exports.paymentServices = {
    validatePayment,
    successfullyPayment,
    failPayment,
};

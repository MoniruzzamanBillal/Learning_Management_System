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
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const CourseEnrollment_model_1 = require("../CourseEnrollment/CourseEnrollment.model");
const payment_constant_1 = require("./payment.constant");
const payment_model_1 = require("./payment.model");
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
    successfullyPayment,
    failPayment,
};

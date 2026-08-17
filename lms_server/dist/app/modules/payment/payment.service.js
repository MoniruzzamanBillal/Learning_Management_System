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
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const payment_constant_1 = require("./payment.constant");
// ! after successfully payment
const successfullyPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id, status } = payload;
    if (status !== "VALID") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment Failed !!!");
    }
    const existingPayment = yield prisma_1.default.payment.findFirst({
        where: { transactionId: tran_id },
    });
    if (!existingPayment) {
        return null;
    }
    const updatedPaymentResult = yield prisma_1.default.payment.update({
        where: { id: existingPayment.id },
        data: { paymentStatus: payment_constant_1.PAYMENTSTATUS.Completed },
    });
    return updatedPaymentResult;
    //
});
// ! for fail paymnet
const failPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id, status } = payload;
    if (status === "FAILED") {
        //
        const existingPayment = yield prisma_1.default.payment.findFirst({
            where: { transactionId: tran_id, paymentStatus: payment_constant_1.PAYMENTSTATUS.Pending },
        });
        if (!existingPayment) {
            return null;
        }
        const courseEnrollmentData = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.payment.update({
                where: { id: existingPayment.id },
                data: { isDeleted: true },
            });
            // paymentId is unique on CourseEnrollment (one payment -> at most one
            // enrollment), so this is a safe unique lookup.
            const enrollment = yield tx.courseEnrollment.findUnique({
                where: { paymentId: existingPayment.id },
            });
            if (!enrollment) {
                return null;
            }
            return tx.courseEnrollment.update({
                where: { id: enrollment.id },
                data: { isDeleted: true },
            });
        }));
        return courseEnrollmentData;
        //
    }
    //
});
//
exports.paymentServices = {
    successfullyPayment,
    failPayment,
};

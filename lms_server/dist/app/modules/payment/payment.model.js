"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentModel = void 0;
const mongoose_1 = require("mongoose");
const payment_constant_1 = require("./payment.constant");
const paymentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    CourseEnrollment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "CourseEnrollment",
    },
    paymentStatus: {
        type: String,
        default: payment_constant_1.PAYMENTSTATUS.Pending,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
//
exports.paymentModel = (0, mongoose_1.model)("Payment", paymentSchema);

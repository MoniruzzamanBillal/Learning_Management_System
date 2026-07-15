"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogModel = void 0;
const mongoose_1 = require("mongoose");
const errorLogSchema = new mongoose_1.Schema({
    message: { type: String, required: true },
    statusCode: { type: Number, required: true },
    errorSources: [
        {
            path: { type: mongoose_1.Schema.Types.Mixed, required: true },
            message: { type: String, required: true },
        },
    ],
    stack: { type: String },
    method: { type: String, required: true },
    path: { type: String, required: true },
    ip: { type: String },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    userRole: { type: String },
}, { timestamps: true });
errorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });
exports.errorLogModel = (0, mongoose_1.model)("ErrorLog", errorLogSchema);

import { model, Schema } from "mongoose";
import { TErrorLog } from "./errorLog.interface";

const errorLogSchema = new Schema<TErrorLog>(
  {
    message: { type: String, required: true },
    statusCode: { type: Number, required: true },
    errorSources: [
      {
        path: { type: Schema.Types.Mixed, required: true },
        message: { type: String, required: true },
      },
    ],
    stack: { type: String },
    method: { type: String, required: true },
    path: { type: String, required: true },
    ip: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userRole: { type: String },
  },
  { timestamps: true },
);

errorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export const errorLogModel = model<TErrorLog>("ErrorLog", errorLogSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoNoteValidationSchema = void 0;
const zod_1 = require("zod");
const upsertVideoNoteSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Note content is required !!!"),
});
//
exports.videoNoteValidationSchema = {
    upsertVideoNoteSchema,
};

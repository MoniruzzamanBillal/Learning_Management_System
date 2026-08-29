import { z } from "zod";

const upsertVideoNoteSchema = z.object({
  content: z.string().min(1, "Note content is required !!!"),
});

//
export const videoNoteValidationSchema = {
  upsertVideoNoteSchema,
};

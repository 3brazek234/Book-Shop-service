import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters"),
});

export const assignTagSchema = z.object({
  bookId: z.string().uuid(),
  tagId: z.string().uuid(),
});
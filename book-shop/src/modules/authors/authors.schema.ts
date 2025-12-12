import z from "zod";

export const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url(),
  bio: z.string().max(1000, "Bio must be at most 1000 characters"),
});

export type AuthorInput = z.infer<typeof authorSchema>;
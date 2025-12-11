import { z } from "zod";
const createCategorySchema = z.object({
    name: z.string().min(3, "name must be at least 3 characters"),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
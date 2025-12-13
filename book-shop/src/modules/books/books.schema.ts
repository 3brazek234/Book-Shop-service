import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price: z.string(), 
  categoryId: z.string().uuid(),
  authorId: z.string().uuid(),
  thumbnail: z.custom<File>((val) => {
    return val instanceof File || typeof val === 'string' || val === undefined || val === null;
  }).optional(),
});

export const queryBookSchema = z.object({
  page: z.string().optional().default("1"),      
  limit: z.string().optional().default("10"),    
  search: z.string().optional(),                
  sort: z.enum(["asc", "desc"]).optional().default("asc"), 
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
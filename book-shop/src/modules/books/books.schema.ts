import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(), 
  categoryId: z.string().uuid(), 
  thumbnail: z.string().url().optional(), 
});

export const queryBookSchema = z.object({
  page: z.string().optional().default("1"),      
  limit: z.string().optional().default("10"),    
  search: z.string().optional(),                
  sort: z.enum(["asc", "desc"]).optional().default("asc"), 
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
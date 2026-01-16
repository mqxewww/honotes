import { z } from "zod";

export const getUserSchema = z.object({
  id: z.string().transform(Number),
});

export const createUserSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

export const patchUserSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
});

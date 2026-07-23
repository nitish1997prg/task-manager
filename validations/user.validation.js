import * as z from "zod";

export const registerUserBodySchema = z.object({
    name: z.string().trim(),
    email: z.email(),
    password: z.string().trim().min(5) 
});

export const loginUserBodySchema = z.object({
    email: z.email(),
    password: z.string().trim(),
});
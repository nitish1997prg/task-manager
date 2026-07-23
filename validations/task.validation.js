import { isValidObjectId, Types } from "mongoose";
import * as z from "zod";

export const createTaskBodySchema = z.object({
    title: z.string().trim().min(5).max(15),
    description: z.string().trim().min(1).max(100).optional(),
});

export const updateTaskBodySchema = z.object({
    title: z.string().trim().min(5).max(15).optional(),
    description: z.string().trim().min(1).max(100).optional(),
    completed: z.boolean().optional()
}).refine((data)=> data.title !== undefined || data.description !== undefined || data.completed !== undefined ,{
    error: "At least one field must be provided!"
});

export const getAllTasksQuerySchema = z.object({
    offset: z.coerce.number().int().nonnegative().default(0),
    limit: z.coerce.number().int().positive().default(10),
    completed: z.enum(["true","false"]).transform(val => val === "true").optional()
});

export const taskIdParamsSchema = z.object({
    id: z.string().refine((val)=> isValidObjectId(val),{error: "Invalid ObjectId"}).transform((val)=> new Types.ObjectId(val))
});


import express from "express";
import { createTask, getAllTasks, getTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authenticate.js";
import {createTaskBodySchema, updateTaskBodySchema, getAllTasksQuerySchema, taskIdParamsSchema } from "../validations/task.validation.js"
import { validate } from "../middlewares/validate.js";

export const taskRoutes = express.Router();

taskRoutes.post('/tasks',authenticate,validate({body: createTaskBodySchema}),createTask);
taskRoutes.get('/tasks',authenticate,validate({query: getAllTasksQuerySchema}), getAllTasks);
taskRoutes.get('/tasks/:id',authenticate,validate({params: taskIdParamsSchema}) ,getTask);
taskRoutes.put('/tasks/:id',authenticate,validate({params: taskIdParamsSchema, body: updateTaskBodySchema}) ,updateTask);
taskRoutes.delete('/tasks/:id',authenticate,validate({params: taskIdParamsSchema}),deleteTask);
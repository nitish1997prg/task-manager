import express from "express";
import { createTask, getAllTasks, getTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authenticate.js";

export const taskRoutes = express.Router();

taskRoutes.post('/tasks',authenticate,createTask);
taskRoutes.get('/tasks',authenticate, getAllTasks);
taskRoutes.get('/tasks/:id',authenticate, getTask);
taskRoutes.put('/tasks/:id',authenticate, updateTask);
taskRoutes.delete('/tasks/:id',authenticate,deleteTask);
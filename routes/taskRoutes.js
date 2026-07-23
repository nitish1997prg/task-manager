import express from "express";
import { createTask, getAllTasks, getTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authenticate.js";
import {createTaskBodySchema, updateTaskBodySchema, getAllTasksQuerySchema, taskIdParamsSchema } from "../validations/task.validation.js"
import { validate } from "../middlewares/validate.js";

export const taskRoutes = express.Router();

/**
 * @openapi
 * /tasks:
 *   post:
 *     operationId: createTask
 *     summary: Create a new task
 *     description: Creates a new task with title and description for authenticated user
 *     tags:
 *       - Tasks
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateTaskResponse'
 *
 *       400:
 *         description: Validation failed
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */
taskRoutes.post('/tasks',authenticate,validate({body: createTaskBodySchema}),createTask);

/**
 * @openapi
 * /tasks:
 *   get:
 *     operation: getTasks
 *     summary: Get all tasks
 *     description: Returns all tasks belonging to the authenticated user.
 *     tags:
 *       - Tasks
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of tasks to skip.
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of tasks to return.
 *
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter tasks by completion status.
 *
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
taskRoutes.get('/tasks',authenticate,validate({query: getAllTasksQuerySchema}), getAllTasks);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     operationId: getTask
 *     summary: Get task by ID
 *     description: Returns a single task belonging to the authenticated user.
 *     tags:
 *       - Tasks
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task
 *
 *     responses:
 *       200:
 *         description: A Single task
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Task'
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
taskRoutes.get('/tasks/:id',authenticate,validate({params: taskIdParamsSchema}) ,getTask);

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     operationId: updateTask
 *     summary: Update task by ID
 *     description: Returns a updated task belonging to the authenticated user.
 *     tags:
 *       - Tasks
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: An updated task
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Task'
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task to be updated was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
taskRoutes.put('/tasks/:id',authenticate,validate({params: taskIdParamsSchema, body: updateTaskBodySchema}) ,updateTask);


/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     operationId: deleteTask
 *     summary: Delete task by ID
 *     description: Delete a task
 *     tags:
 *       - Tasks
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task
 *     responses:
 *       200:
 *         description: Task was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/DeleteTaskResponse'
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task to be deleted was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
taskRoutes.delete('/tasks/:id',authenticate,validate({params: taskIdParamsSchema}),deleteTask);
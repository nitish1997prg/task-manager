import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { registerUserBodySchema, loginUserBodySchema } from "../validations/user.validation.js";
import { validate } from "../middlewares/validate.js";

export const userRoutes = express.Router();

/**
 * @openapi
 * /register:
 *   post:
 *     operationId: registerUser
 *     summary: Register a new user
 *     description: Registers a user with name, email and password
 *     tags:
 *       - Users
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User already exists
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 */
userRoutes.post('/register',validate({body: registerUserBodySchema}),registerUser);

/**
 * @openapi
 * /login:
 *   post:
 *     operationId: loginUser
 *     summary: Login a registered user
 *     description: Logs in a user with valid email address and password
 *     tags:
 *       - Users
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid Credentials - email or password
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 */
userRoutes.post('/login',validate({body: loginUserBodySchema}),loginUser);
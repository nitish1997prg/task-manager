import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { registerUserBodySchema, loginUserBodySchema } from "../validations/user.validation.js";
import { validate } from "../middlewares/validate.js";

export const userRoutes = express.Router();

userRoutes.post('/register',validate({body: registerUserBodySchema}),registerUser);
userRoutes.post('/login',validate({body: loginUserBodySchema}),loginUser);
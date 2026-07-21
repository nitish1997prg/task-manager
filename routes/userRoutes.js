import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

export const userRoutes = express.Router();

userRoutes.post('/register',registerUser);
userRoutes.post('/login',loginUser);
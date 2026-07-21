import express from "express";
import { taskRoutes } from "./routes/taskRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(userRoutes)
app.use(taskRoutes);

export default app;
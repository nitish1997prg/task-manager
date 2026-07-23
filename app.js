import express from "express";
import { taskRoutes } from "./routes/taskRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(userRoutes)
app.use(taskRoutes);
app.use(errorHandler)

export default app;
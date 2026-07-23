import express from "express";
import { taskRoutes } from "./routes/taskRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(express.json());
app.use(userRoutes)
app.use(taskRoutes);
app.use("/docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.use(errorHandler)

export default app;
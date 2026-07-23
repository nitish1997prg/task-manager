import AppError from "../utils/AppError.js";

export default function errorHandler(err, req, res, next) {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    return res.status(500).json({
        message: "An internal server error occurred."
    });
}
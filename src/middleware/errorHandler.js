import { AppError } from "../errors/AppError.js";
import { logger } from "../logger/logger.js";

export function errorHandler(
    err,
    req,
    res,
    _next
) {

    if (err instanceof AppError) {
        logger.warn(
            {
                requestId: req.requestId,
                err,
            },
            "Operational error"
        );
    } else {
        logger.error(
            {
                requestId: req.requestId,
                err,
            },
            "Unexpected application error"
        );
    }

    const statusCode =
        err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        error: {
            message:
                statusCode === 500
                    ? "Internal Server Error"
                    : err.message,

            ...(err.details && {
                details: err.details,
            }),
        },
    });
}
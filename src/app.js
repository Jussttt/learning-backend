import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { API_PREFIX } from "./config/constants.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { requestLogger } from "./logger/requestlogger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { checkDatabaseHealth } from "./monitoring/healthService.js";
import { asyncHandler } from "./utils/asyncHandler.js";


export function createApp(){
    const app=express();
    app.disable("x-powered-by");



    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(express.json({
        limit: "1mb",
    }));
    app.use(requestIdMiddleware);
    app.use(requestLogger);


    app.get(
    `${API_PREFIX}/health`,
    async (req, res) => {
        try {
            await checkDatabaseHealth();

            return res.status(200).json({
                status: "ok",
                database: "connected",
            });
        } catch (err) {
            req.log.error(
                { err },
                "Health check failed"
            );

            return res.status(503).json({
                status: "degraded",
                database: "disconnected",
            });
        }
    }
    );

    

    app.use(notFoundHandler);

    app.use(errorHandler);
    

    return app;
}
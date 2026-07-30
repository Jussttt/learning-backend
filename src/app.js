import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { API_PREFIX } from "./config/constants.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { requestLogger } from "./logger/requestLogger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./api/routes/authRoutes.js";
import userRoutes from "./api/routes/userRoutes.js";
import postRoutes from "./api/routes/postRoutes.js";
import commentRoutes from "./api/routes/commentRoutes.js";
import feedRoutes from "./api/routes/feedRoute.js";
import storyRoutes
from "./api/routes/storyRoutes.js";
import conversationRoutes
from "./api/routes/conversationRoutes.js";
import uploadRoutes
from "./api/routes/uploadRoutes.js";
import notificationRoutes from "./api/routes/notificationRoutes.js";
import healthRoutes from "./api/routes/healthRoutes.js"
import { metricsMiddleware } from "./middleware/metricsMiddleware.js";
import { getMetrics } from "./monitoring/metricsController.js";


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
    app.use(metricsMiddleware);


    app.use(`${API_PREFIX}/auth`,authRoutes);

    app.use(
        `${API_PREFIX}/users`,
        userRoutes
    );
    app.use(
        `${API_PREFIX}/posts`,
        postRoutes
    );
    app.use(
        `${API_PREFIX}/comments`,
        commentRoutes
    );

    app.use(
        `${API_PREFIX}/feed`,
        feedRoutes
    );
    app.use(
        `${API_PREFIX}/stories`,
        storyRoutes
    );
    app.use(
        `${API_PREFIX}/conversations`,
        conversationRoutes
    );

    app.use(
        `${API_PREFIX}/uploads`,
        uploadRoutes
    );

    app.use(
        `${API_PREFIX}/notifications`,
        notificationRoutes
    );

    app.use(
        `${API_PREFIX}/health`,
        healthRoutes
    );

    app.get(
        "/metrics",
        getMetrics
    );

    app.get("/test500", (req, res) => {
        throw new Error("Testing 500");
    });

    

    app.use(notFoundHandler);

    app.use(errorHandler);
    

    return app;
}
import client from "prom-client";
import { register } from "../metricsRegistry.js";

export const likesCreatedCounter =
    new client.Counter({
        name: "instagram_likes_created_total",
        help: "Total likes created"
    });

register.registerMetric(likesCreatedCounter);
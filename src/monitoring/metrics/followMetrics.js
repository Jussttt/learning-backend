import client from "prom-client";
import { register } from "../metricsRegistry.js";

export const followsCreatedCounter =
    new client.Counter({
        name: "instagram_follows_created_total",
        help: "Total follow operations"
    });

register.registerMetric(followsCreatedCounter);
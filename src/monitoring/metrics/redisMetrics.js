import client from "prom-client";

import { register } from "../metricsRegistry.js";

export const redisConnectionGauge =
    new client.Gauge({
        name: "instagram_redis_connected",
        help: "Redis connection status"
    });

register.registerMetric(redisConnectionGauge);
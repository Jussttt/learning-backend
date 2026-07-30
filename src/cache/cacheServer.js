import { createClient } from "redis";
import { env } from "../config/env.js";
import { logger } from "../logger/logger.js";

import { setRedisConnected,
    setRedisDisconnected
 } from "../monitoring/metricsService.js";


export const cacheClient = createClient({
    url: env.REDIS_URL
});

cacheClient.on(
    "ready",
    () => {
        logger.info(
            "Redis cache connected"
        );

        setRedisConnected();
    }
);

cacheClient.on(
    "end",
    () => {
        logger.warn(
            "Redis cache connection closed"
        );

        setRedisDisconnected();
    }
);

cacheClient.on(
    "error",
    (err) => {

        logger.error(
            { err },
            "Redis cache error"
        );

        setRedisDisconnected();
    }
);
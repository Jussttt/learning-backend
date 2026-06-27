import { createClient }
from "redis";

import { env }
from "../config/env.js";

export const socketPubClient =
    createClient({
        url: env.REDIS_URL
    });

export const socketSubClient =
    socketPubClient.duplicate();
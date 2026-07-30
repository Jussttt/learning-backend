import client from "prom-client";

import { register } from "../metricsRegistry.js";

export const loginCounter=
    new client.Counter({
        name: "instagram_logins_total",
        help: "Total login attempts",
        labelNames:[
            "status"
        ]
    });

register.registerMetric(loginCounter);

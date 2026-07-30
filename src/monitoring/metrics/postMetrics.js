import client from "prom-client";

import { register } from "../metricsRegistry.js";

export const postsCreatedCounter=   
    new client.Counter({
        name:"instagram_posts_created_total",
        help:"Posts created",
        labelNames:[
            "post_type"
        ]
    });

register.registerMetric(
    postsCreatedCounter
);
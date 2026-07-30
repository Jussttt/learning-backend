import client from "prom-client";

import { register } from "../metricsRegistry.js";

export const storyJobCounter=new client.Counter({
    name:"instagram_story_jobs_total",
    help:"story jobs",
    labelNames:[
        "status"
    ]
});
register.registerMetric(storyJobCounter);

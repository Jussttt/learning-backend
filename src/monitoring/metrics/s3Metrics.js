import client from "prom-client";

import { register } from "../metricsRegistry.js";


export const uploadsCounter =
    new client.Counter({
        name: "instagram_s3_uploads_total",
        help: "Successful S3 uploads"
    });

register.registerMetric(uploadsCounter);
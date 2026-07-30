import client from "prom-client";
import { register } from "../metricsRegistry.js";

export const notificationCounter =
    new client.Counter({
        name: "instagram_notifications_created_total",
        help: "Notification created",
        labelNames:[
            "type"
        ]
    });

register.registerMetric(notificationCounter);
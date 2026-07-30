import client from "prom-client";

import { register } from "../metricsRegistry.js";

export const activeConnectionsGauge =
    new client.Gauge({
        name: "instagram_socket_connections",
        help: "Current active websocket connections"
    });

register.registerMetric(activeConnectionsGauge);
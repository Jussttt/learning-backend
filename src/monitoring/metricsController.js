import { register } from "./metricsRegistry.js";

export async function getMetrics(
    req,
    res
){
    res.set(
        "Content-Type",
        register.contentType
    );

    res.end(
        await register.metrics()
    );
}
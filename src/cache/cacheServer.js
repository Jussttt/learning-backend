import { createClient } from "redis";
import { env } from "../config/env.js";

export const cacheClient=createClient({
    url: env.REDIS_URL
});

cacheClient.on(
    "error",
    (err)=>{
        console.error(
            "Redis Cache Error",
            err
        );
    }
);

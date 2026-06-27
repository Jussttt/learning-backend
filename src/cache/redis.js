import {createClient} from "redis";
import { env } from "../config/env.js";

export const publisher=
    createClient({
        url:
            env.REDIS_URL
    });

export const subscriber=publisher.duplicate();

publisher.on(
    "error",
    (err)=>{
        console.error(
            "Redis Publisher Error",
            err
        );
    }
);

subscriber.on(
    "error",
    (err)=>{
        console.error(
            "Redis Subscriber Error",
            err
        );
    }
);
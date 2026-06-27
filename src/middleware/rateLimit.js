import { cacheClient } from "../cache/cacheServer.js";

export function rateLimit({
    limit,
    windowSeconds,
    prefix
}){
    return async (
        req,
        res,
        next
    )=>{
        const key=`${prefix}:${req.ip}`;
        const count=await cacheClient.incr(key);
        if(count==1){
            await cacheClient.expire(
                key,
                windowSeconds
            );
        }

        if(count>limit){

            const ttl=await cacheClient.ttl(key);

            res.set(
                "Retry-After",
                ttl
            );
            return res.status(429).json({
                message: "Too many requests"
            });
        }

        res.set(
            "X-RateLimit_Limit",
            limit
        );

        res.set(
            "X-RateLimit-Remaining",
            Math.max(
                0,
                limit-count
            )
        );

        next();
    };
}
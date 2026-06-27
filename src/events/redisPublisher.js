import { eventBus } from "./eventBus.js";
import { publisher } from "../cache/redis.js";
import { CHANNELS } from "./channels.js";

export function registerRedisPublisher(){
    eventBus.on(
        "message.created",
        async(payload)=>{

            console.log(
                "PUBLISHED TO REDIS:",
                payload
            );

            await publisher.publish(
                CHANNELS.MESSAGE_CREATED,
                JSON.stringify(payload)
            );

        }
    );
}
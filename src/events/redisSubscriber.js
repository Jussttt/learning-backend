import { subscriber } from "../cache/redis.js";

import { CHANNELS } from "./channels.js";

export function registerRedisSubscriber(
    io
){
    subscriber.subscribe(
        CHANNELS.MESSAGE_CREATED,

        (message)=>{

            const payload =
                JSON.parse(message);

            console.log(
                "RECEIVED FROM REDIS:",
                payload
            );

            const { 
                conversationId,
                message: newMessage
            } = payload;

            io.to(
                `conversation:${conversationId}`
            ).emit(
                "message:new",
                newMessage
            );

        }
    );
}
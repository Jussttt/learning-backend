import { enqueueNotification } from "./producers/notificationProducer.js";

await enqueueNotification({
    test:true,
    message:"Hello BullMQ"
});
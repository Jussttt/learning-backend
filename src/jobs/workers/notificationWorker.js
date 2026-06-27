import { Worker } from "bullmq";
import { createNotification } from "../../repositories/notificationRepository.js";
import { bullConnection } from "../bullConnection.js";
import { eventBus } from "../../events/eventBus.js";


const worker=new Worker(
    "notification",

    async(job)=>{
        const notification=await createNotification(
            {
                recipientUserId:job.data.recipientUserId,
                actorUserId:job.data.actorUserId,
                type:job.data.type,
                entityId:job.data.entityId
            }
        );

        eventBus.emit(
            "notification.created",
            notification
        );
    },
    {
        connection:bullConnection
    }
);


worker.on(
    "completed",
    (job)=>{
        console.log(
            `Completed ${job.id}`
        );
    }
)

worker.on(
    "failed",
    (job,error)=>{
        console.error(
            error
        );
    }
);
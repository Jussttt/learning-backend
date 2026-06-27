import { notificationQueue } from "../queues/notificationQueue.js";

export async function enqueueNotification(
    data
) {
    await notificationQueue.add(
        "create-notification",
        data
    );
}
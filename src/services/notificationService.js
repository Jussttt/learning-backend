
import { eventBus } from "../events/eventBus.js";
import { findNotificationsByUserId } from "../repositories/notificationRepository.js";
import {
    createNotification
} from "../repositories/notificationRepository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { markNotificationAsRead } from "../repositories/notificationRepository.js";
import {
    getUnreadNotificationCount
}
from "../repositories/notificationRepository.js";


export async function getNotifications(
    userId,
    limit,
    offset
){
    return await findNotificationsByUserId(
        userId,
        limit,
        offset
    );
}

export async function createNotificationService(
    client,
    data
){
    const notification= await createNotification(
        client,
        data
    );

    eventBus.emit(
        "notification.created",
        notification
    );
    return notification;
}

export async function markNotificationRead(
    notificationId,
    userId
){
    const notification =
        await markNotificationAsRead(
            notificationId,
            userId
        );

    if(!notification){
        throw new NotFoundError(
            "Notification not found"
        );
    }

    return notification;
}



export async function getUnreadCount(
    userId
){
    return await getUnreadNotificationCount(
        userId
    );
}
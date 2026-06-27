import { markNotificationRead as markNotificationReadService } from "../../services/notificationService.js";
import { getNotifications as getNotificationsService } from "../../services/notificationService.js";
import { getUnreadCount as getUnreadCountService } from "../../services/notificationService.js";


export async function getNotifications(
    req,
    res
){
    const notifications=await getNotificationsService(
        req.user.userId,
        req.validatedQuery.limit,
        req.validatedQuery.offset
    );
    return res.status(200).json({
        success:true,
        notifications,
    });
}

export async function markNotificationRead(
    req,
    res
){
    const notification =
        await markNotificationReadService(
            req.params.notificationId,
            req.user.userId
        );

    res.status(200).json(
        notification
    );
}

export async function getUnreadCount(
    req,
    res
){
    const count =
        await getUnreadCountService(
            req.user.userId
        );

    res.status(200).json({
        unreadCount: count
    });
}
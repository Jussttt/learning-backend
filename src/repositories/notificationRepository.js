import { pool } from "../db/pool.js";

export async function createNotification(
    client,
    {
        recipientUserId,
        actorUserId,
        type,
        entityId
    }
){
    const result =
        await client.query(
            `
            INSERT INTO notifications(
                recipient_user_id,
                actor_user_id,
                type,
                entity_id
            )
            VALUES(
                $1,
                $2,
                $3,
                $4
            )
            RETURNING *
            `,
            [
                recipientUserId,
                actorUserId,
                type,
                entityId
            ]
        );

    return result.rows[0];
}

export async function findNotificationsByUserId(
    userId,
    limit,
    offset
){
    
    
    const result =
        await pool.query(
            `
            SELECT
                n.id,
                n.type,
                n.entity_id,
                n.is_read,
                n.created_at,

                a.id AS actor_user_id,
                a.profile_name

            FROM notifications n

            JOIN app_users a
            ON n.actor_user_id = a.id

            WHERE
                n.recipient_user_id = $1

            ORDER BY
                n.created_at DESC

            LIMIT $2
            OFFSET $3
            `,
            [
                userId,
                limit,
                offset
            ]
        );

    return result.rows;
}

export async function markNotificationAsRead(
    notificationId,
    userId
){
    const result =
        await pool.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE
                id = $1
                AND recipient_user_id = $2
            RETURNING
                id,
                is_read
            `,
            [
                notificationId,
                userId
            ]
        );

    return result.rows[0] ?? null;
}

export async function getUnreadNotificationCount(
    userId
){
    const result =
        await pool.query(
            `
            SELECT COUNT(*) AS unread_count
            FROM notifications
            WHERE
                recipient_user_id = $1
                AND is_read = FALSE
            `,
            [userId]
        );

    return Number(
        result.rows[0].unread_count
    );
}
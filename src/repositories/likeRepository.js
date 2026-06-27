import { pool } from "../db/pool.js";

export async function doesLikeExist(
    userId,
    postId
) {
    const result=await pool.query(
        `
        SELECT EXISTS(
            SELECT 1
            FROM likes
            WHERE user_id=$1
            AND post_id=$2
        ) AS exists
        `,
        [
            userId,
            postId
        ]
    );

    return result.rows[0].exists;
}

export async function createLike(
    client,
    {
        userId,
        postId
    }
    
){
    await client.query(
        `
        INSERT INTO likes (
            user_id,
            post_id
        )
        VALUES ($1, $2)
        `,
        [
            userId,
            postId
        ]
    );
}

export async function deleteLike(
    userId,
    postId
){
    await pool.query(
        `
        DELETE FROM likes
        WHERE user_id = $1
        AND post_id = $2
        `,
        [
            userId,
            postId
        ]
    );
}

export async function getLikeCount(
    postId
){
    const result =
        await pool.query(
            `
            SELECT COUNT(*)
            AS like_count
            FROM likes
            WHERE post_id = $1
            `,
            [postId]
        );

    return Number(
        result.rows[0].like_count
    );
}
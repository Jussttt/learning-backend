import { pool } from "../db/pool.js";

export async function createComment(
    client,
    {
        userId,
        postId,
        content
    }
    
) {
    const result=await pool.query(
        `
        INSERT INTO comments(
            user_id,
            post_id,
            content
        )
        VALUES(
            $1,
            $2,
            $3
        )
        RETURNING *
        `,
        [
            userId,
            postId,
            content
        ]
    );

    return result.rows[0];
}

export async function findCommentByPostId(
    postId
){
    const result=await pool.query(
        `
        SELECT 
            c.id,
            c.content,
            c.created_at,

            u.id as user_id,
            u.profile_name
        FROM comments c

        JOIN app_users u 
        ON c.user_id=u.id

        WHERE c.post_id=$1
        AND c.deleted_at IS NULL

        ORDER BY c.created_at ASC
        `,
        [postId]
    );

    return result.rows;
}

export async function findCommentForDeletion(
    commentId
){
    const result=await pool.query(
        `
        SELECT 
            c.id,
            c.user_id,
            c.post_id,
            c.deleted_at,

            p.created_by_user_id AS post_owner_id,
            p.deleted_at AS post_deleted_at
            FROM comments c

            JOIN posts P
            ON c.post_id=p.id

            WHERE c.id=$1
        `,[commentId]
    );

    return result.rows[0]??null;
}

export async function softDeleteComment(
    commentId
){
    await pool.query(
        `
        UPDATE comments
        SET
            deleted_at=NOW(),
            updated_at=NOW()
        WHERE id=$1
        `,
        [commentId]
    );
}



export async function getCommentCount(
    postId
){
    const result =
        await pool.query(
            `
            SELECT COUNT(*)
            AS comment_count
            FROM comments
            WHERE post_id = $1
            AND deleted_at IS NULL
            `,
            [postId]
        );

    return Number(
        result.rows[0].comment_count
    );
}
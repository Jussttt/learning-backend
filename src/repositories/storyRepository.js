import { pool } from "../db/pool.js";

export async function createStory(data){
    const result=await pool.query(
        `
        INSERT INTO stories(
            user_id,
            media_type,
            media_key,
            caption,
            expires_at
        )
        VALUES(
            $1,
            $2,
            $3,
            $4,
            $5

        )
        RETURNING *
        `,
        [
            data.userId,
            data.mediaType,
            data.mediaKey,
            data.caption,
            data.expiresAt,
        ]
    );
    return result.rows[0];
}

export async function findStoryFeed(userId){
    const result=await pool.query(
        `
        SELECT
            s.id,
            s.user_id,
            s.media_type,
            s.media_key,
            s.caption,
            s.created_at,

            u.profile_name,

            CASE
                WHEN sv.story_id IS NULL
                THEN FALSE
                ELSE TRUE
            END AS viewed

        FROM stories s

        JOIN app_users u
        ON s.user_id = u.id

        LEFT JOIN story_views sv
        ON sv.story_id = s.id
        AND sv.user_id = $1

        WHERE
            s.expires_at > NOW()
            AND deleted_at IS NULL;
        `,
        [userId]
    );
    return result.rows;
}

export async function findStoryById(
    storyId
){
    const result =
        await pool.query(
            `
            SELECT
                id,
                user_id,
                expires_at
            FROM stories
            WHERE id = $1
            `,
            [storyId]
        );

    return result.rows[0] ?? null;
}

export async function hasViewedStory(
    userId,
    storyId
){
    const result =
        await pool.query(
            `
            SELECT EXISTS(
                SELECT 1
                FROM story_views
                WHERE user_id = $1
                AND story_id = $2
            ) AS exists
            `,
            [
                userId,
                storyId
            ]
        );

    return result.rows[0].exists;
}

export async function createStoryView(
    userId,
    storyId
){
    await pool.query(
        `
        INSERT INTO story_views (
            user_id,
            story_id
        )
        VALUES (
            $1,
            $2
        )
        `,
        [
            userId,
            storyId
        ]
    );
}

export async function findStoryOwner(storyId){
    const  result =await pool.query(
        `
        SELECT
            id,
            user_id,
            expires_at
        FROM stories
        WHERE id=$1
        `,
        [storyId]
    );
    
    return result.rows[0] ?? null;
}


export async function getStoryViewers(storyId){
    
    const result=await pool.query(
        `
        SELECT 
            u.id,
            u.profile_name,
            sv.viewed_at
        FROM story_views sv


        JOIN app_users u
        ON sv.user_id=u.id

        WHERE sv.story_id=$1

        ORDER BY sv.viewed_at DESC
        `,
        [storyId]
    );
    
    return result.rows;
}

export async function expireStory(
    storyId
){
    const result =
        await pool.query(
            `
            UPDATE stories
            SET deleted_at = NOW()
            WHERE
                id = $1
                AND deleted_at IS NULL
            RETURNING id
            `,
            [storyId]
        );

    return result.rows[0] ?? null;
}

export async function findStoriesForCleanup(){
    const result=await pool.query(
        `
        SELECT
            id,
            media_key
        FROM stories
        WHERE 
            deleted_at<
            NOW()-INTERVAL '30 DAYS'
        `
    );

    return result.rows;
}

export async function deleteStory(
    storyId
){
    await pool.query(
        `
        DELETE FROM stories
        WHERE id=$1
        `,
        [storyId]
    );
}
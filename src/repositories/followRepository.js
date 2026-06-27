import { pool } from "../db/pool.js";

export async function doesFollowRelationshipExists(
    followingUserId,
    followedUserId
){
    const result=await pool.query(
        `
            SELECT EXISTS(
                SELECT 1 
                FROM followers
                WHERE following_user_id=$1
                AND followed_user_id=$2
            ) AS exists
            `,[
                followingUserId,
                followedUserId
            ]
        );
    return result.rows[0].exists;
}


export async function createFollow(
    client,
    {
        followingUserId,
        followedUserId
    }
    
) {

    await client.query(
        `
        INSERT INTO followers (
            following_user_id,
            followed_user_id
        )
        VALUES ($1, $2)
        `,
        [
            followingUserId,
            followedUserId
        ]
    );
}

export async function deleteFollow(
    followingUserId,
    followedUserId
) {

    await pool.query(
        `
        DELETE FROM followers
        WHERE following_user_id = $1
        AND followed_user_id = $2
        `,
        [
            followingUserId,
            followedUserId
        ]
    );
}


export async function getFollowCounts(
    userId
) {

    const result =
        await pool.query(
            `
            SELECT
                (
                    SELECT COUNT(*)
                    FROM followers
                    WHERE followed_user_id = $1
                ) AS follower_count,

                (
                    SELECT COUNT(*)
                    FROM followers
                    WHERE following_user_id = $1
                ) AS following_count
            `,
            [userId]
        );

    return {
        followers: Number(result.rows[0].follower_count),
        following: Number(result.rows[0].following_count),
    };
}
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { findUserById } from "../repositories/authRepository.js";
import { createFollow, deleteFollow, doesFollowRelationshipExists, getFollowCounts } from "../repositories/followRepository.js";
import { CacheKeys } from "../cache/cacheKeys.js";
import { cacheClient } from "../cache/cacheServer.js";
import { logger } from "../logger/logger.js";
import { NotificationTypes } from "../constants/notificationTypes.js";
import { createNotification } from "../repositories/notificationRepository.js";
import { pool } from "../db/pool.js";
import { eventBus } from "../events/eventBus.js";

export async function followUser(currentUserId,targetUserId){
    if(Number(currentUserId)===Number(targetUserId)){
        logger.warn(
            {
                userId: currentUserId
            },
            "Follow request rejected: attempted self follow"
        );
        throw new ConflictError("You Cannot Follow yourself");
    }


    const targetUser=await findUserById(targetUserId);

    if(!targetUser){

        logger.warn(
            {
                followerUserId: currentUserId,
                targetUserId
            },
            "Follow request rejected: target user not found"
        );

        throw new NotFoundError("User not found");
    }

    const alreadyFollowing= await doesFollowRelationshipExists(
        currentUserId,
        targetUserId
    );

    if(alreadyFollowing){

        logger.warn(
            {
                followerUserId: currentUserId,
                followedUserId: targetUserId
            },
            "Follow request rejected: already following"
        );
        throw new ConflictError("Already following this user");
    }
    let notification;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await createFollow(
            client,
            {
                followingUserId:currentUserId,
                followedUserId:targetUserId
            }
            
        );

        
        notification=await createNotification(
            client,
            {
                recipientUserId: targetUserId,
                actorUserId: currentUserId,
                type: NotificationTypes.FOLLOW,
                entityId: currentUserId
            }
        );

        await client.query("COMMIT");
    }
    catch (err) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackErr) {
            logger.error(
                { rollbackErr },
                "Transaction rollback failed"
            );
        }

        throw err;
    }
    finally{
        client.release();
    }


    if(notification){
        eventBus.emit(
            "notification.created",
            notification
        );
    }
    

    await Promise.all([
        cacheClient.del(
            CacheKeys.followStats(
                currentUserId
            )
        ),

        cacheClient.del(
            CacheKeys.followStats(
                targetUserId
            )
        )
    ]);

    logger.info(
        {
            followerUserId: currentUserId,
            followedUserId: targetUserId
        },
        "User followed another user"
    );
}

export async function unfollowUser(
    currentUserId,
    targetUserId
){
    if(Number(currentUserId)===Number(targetUserId)){
        logger.warn(
            {
                userId: currentUserId
            },
            "Unfollow request rejected: attempted self unfollow"
        );
        throw new ConflictError("You cannot unfollow yourself");
    }

    const targetUser=await findUserById(targetUserId);

    if(!targetUser){
        logger.warn(
            {
                followerUserId: currentUserId,
                targetUserId
            },
            "Unfollow request rejected: target user not found"
        );
        throw new NotFoundError("User not found");
    }

    const alreadyFollowing=await doesFollowRelationshipExists(
        currentUserId,targetUserId
    );

    if(!alreadyFollowing){

        logger.warn(
            {
                followerUserId: currentUserId,
                followedUserId: targetUserId
            },
            "Unfollow request rejected: not following user"
        );
        throw new ConflictError("You are not following this user");
    }
 
    await  deleteFollow(currentUserId,
        targetUserId);

    await Promise.all([
        cacheClient.del(
            CacheKeys.followStats(
                currentUserId
            )
        ),

        cacheClient.del(
            CacheKeys.followStats(
                targetUserId
            )
        )
    ]);
    logger.info(
        {
            followerUserId: currentUserId,
            followedUserId: targetUserId
        },
        "User unfollowed another user"
    );

}

export async function getUserFollowStats(userId){
    const user=
    await findUserById(userId);

    if(!user){

    logger.warn(
            {
                userId
            },
            "Follow stats request rejected: user not found"
        );

        throw new NotFoundError(
            "User not found"
        );
    }

    const cacheKey =
        CacheKeys.followStats(
            userId
        );

    const cached =
        await cacheClient.get(
            cacheKey
        );

    if(cached){
        // logger.info(
        //     { cacheKey },
        //     "Follow stats cache hit"
        // );

        return JSON.parse(
            cached
        );
    }

    logger.info(
        { cacheKey },
        "Follow stats cache miss"
    );

    const stats =
        await getFollowCounts(
            userId
        );

    await cacheClient.set(
        cacheKey,
        JSON.stringify(stats),
        {
            EX: 300
        }
    );

    return stats;

}
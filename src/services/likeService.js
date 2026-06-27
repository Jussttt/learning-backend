import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { doesLikeExist } from "../repositories/likeRepository.js";
import { findPostOwner } from "../repositories/postRepository.js";
import { getLikeCount ,createLike,deleteLike} from "../repositories/likeRepository.js";
import { createNotification } from "../repositories/notificationRepository.js";
import { NotificationTypes } from "../constants/notificationTypes.js";
import { eventBus } from "../events/eventBus.js";
import { pool } from "../db/pool.js";
import { logger } from "../logger/logger.js";

export async function likePost(
    currentUserId,
    postId
){
    const post=await findPostOwner(postId);

    if(!post || post.deleted_at){

        logger.warn(
            {
                userId: currentUserId,
                postId
            },
            "Like request rejected: post not found"
        );
        throw new NotFoundError("Post not found");
    }

    const alreadyLiked=await doesLikeExist(
        currentUserId,
        postId
    );
    if(alreadyLiked){
        logger.warn(
            {
                userId: currentUserId,
                postId
            },
            "Like request rejected: post already liked"
        );
        throw new ConflictError("Post already liked");
    } 

    let notification;
    const client=await pool.connect();
    try{
        await client.query("BEGIN");

        await createLike(
            client,
            {
                userId:currentUserId,
                postId:postId
            }
            
        );

        if(Number(post.created_by_user_id)!==
            Number(currentUserId)
        ){
            notification=await createNotification(
                client,
                {
                    recipientUserId:post.created_by_user_id,
                    actorUserId:currentUserId,
                    type:NotificationTypes.LIKE,
                    entityId:postId
                }
            );
        }

        await client.query("COMMIT");
    }catch(err){

        try{
            await client.query("ROLLBACK");
        }catch(rollbackErr){

            logger.error(
                { rollbackErr },
                "Failed to rollback like transaction"
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

    logger.info(
        {
            userId: currentUserId,
            postId,
            postOwnerId: post.created_by_user_id
        },
        "Post liked"
    );
}

export async function unlikePost(
    currentUserId,
    postId
){
    const post =
        await findPostOwner(postId);

    if (
        !post ||
        post.deleted_at
    ){
        logger.warn(
            {
                userId: currentUserId,
                postId
            },
            "Unlike request rejected: post not found"
        );
        throw new NotFoundError(
            "Post not found"
        );
    }

    const alreadyLiked =
        await doesLikeExist(
            currentUserId,
            postId
        );

    if (!alreadyLiked){
        logger.warn(
            {
                userId: currentUserId,
                postId
            },
            "Unlike request rejected: post not liked"
        );
        throw new ConflictError(
            "Post is not liked"
        );
    }

    await deleteLike(
        currentUserId,
        postId
    );

        logger.info(
        {
            userId: currentUserId,
            postId,
            postOwnerId: post.created_by_user_id
        },
        "Post unliked"
    );
}

export async function getPostLikeCount(
    postId
){
    const post =
        await findPostOwner(postId);

    if (
        !post ||
        post.deleted_at
    ){
        logger.warn(
            {
                postId
            },
            "Like count request rejected: post not found"
        );
        throw new NotFoundError(
            "Post not found"
        );
    }

    return {
        likes:
            await getLikeCount(
                postId
            ),
    };
}
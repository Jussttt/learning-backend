import { NotFoundError } from "../errors/NotFoundError.js";
import { createComment, findCommentByPostId, findCommentForDeletion, softDeleteComment ,getCommentCount} from "../repositories/commentRepository.js";
import { findPostOwner } from "../repositories/postRepository.js";
import { eventBus } from "../events/eventBus.js";
import { createNotification } from "../repositories/notificationRepository.js";
import { pool } from "../db/pool.js";
import { NotificationTypes } from "../constants/notificationTypes.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";


    export async function createPostComment(
        currentUserId,
        postId,
        content
    ){
        const post =
            await findPostOwner(postId);

        if(!post || post.deleted_at){
            throw new NotFoundError(
                "Post not Found"
            );
        }

        let notification;

        const client =
            await pool.connect();

        try{
                await client.query("BEGIN");

                const comment =
                    await createComment(
                        client,
                        {
                            userId: currentUserId,
                            postId,
                            content
                        }
                    );

                if(
                    Number(post.created_by_user_id) !==
                    Number(currentUserId)
                ){
                    notification =
                        await createNotification(
                            client,
                            {
                                recipientUserId:
                                    post.created_by_user_id,

                                actorUserId:
                                    currentUserId,

                                type:
                                    NotificationTypes.COMMENT,

                                entityId:
                                    comment.id
                            }
                        );
                }

                await client.query(
                    "COMMIT"
                );

                if(notification){
                    eventBus.emit(
                        "notification.created",
                        notification
                    );
                }

                return comment;

            }catch(err){

                await client.query(
                    "ROLLBACK"
                );

                throw err;

            }finally{
                client.release();
            }
    }
    

export async function getPostComments(postId){
    const post=await findPostOwner(postId);

    if(!post || post.deleted_at){
        throw new NotFoundError("Post not Found");
    }

    return await findCommentByPostId(postId);
}

export async function deleteComment(
    currentUserId,
    commentId
) {
    const comment=await findCommentForDeletion(commentId);

    if(!comment || comment.deleted_at || comment.post_deleted_at){
        throw new NotFoundError("Comment not Found");
    }

    const isCommentOwner=
        Number(comment.user_id)===Number(currentUserId);

    const isPostOwner=
        Number(comment.post_owner_id)===Number(currentUserId);

    if (
        !isCommentOwner &&
        !isPostOwner
    ){
        throw new ForbiddenError(
            "You are not allowed to delete this comment"
        );
    }

    await softDeleteComment(commentId);
}


export async function getPostCommentCount(
    postId
){
    const post =
        await findPostOwner(
            postId
        );

    if (
        !post ||
        post.deleted_at
    ){
        throw new NotFoundError(
            "Post not found"
        );
    }

    return {
        comments:
            await getCommentCount(
                postId
            ),
    };
}
import { NotFoundError } from "../errors/NotFoundError.js";
import { createPost, createPostMedia, findPostById, findPostMediaByPostId, findPostOwner, findPostsByUserId, findPostTypesByName, searchPosts, softDeletePost } from "../repositories/postRepository.js";
import { pool } from "../db/pool.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { findUserById } from "../repositories/authRepository.js";
import { generateReadUrl } from "../storage/s3Service.js";
import { logger } from "../logger/logger.js";

export async function createUserPost(
    currentUserId,
    data
){
    const postType=await findPostTypesByName(data.post_type);

    if(!postType){
        logger.warn(
            {
                userId: currentUserId,
                postType: data.post_type
            },
            "Post creation rejected: invalid post type"
        );
        throw new NotFoundError("Post type not found");
    }

    const client=await pool.connect();
    let transactionStarted=false;

    let post;

    
    try{
        
        await client.query("BEGIN");
        transactionStarted=true;
        

        post=await createPost(client,{
            createdByUserId:currentUserId,
            postTypeId:postType.id,
            locationId:data.locationId??null,
            caption:data.caption??null,
        });

        if(
            data.media?.length
        ){
            const mediaRows=
                data.media.map(
                    (media)=>({
                        postId:
                            post.id,

                        mediaKey:
                            media.media_key,

                        mediaType:
                            media.media_type,

                        position:
                            media.position,

                        width:
                            media.width,

                        height:
                            media.height
                    })
                );
            await createPostMedia(
                client,
                mediaRows
            );
        }

        await client.query("COMMIT");
        
    }catch (err) {

        if (transactionStarted) {

            try {
                await client.query("ROLLBACK");
            } catch (rollbackErr) {

                logger.error(
                    { rollbackErr },
                    "Failed to rollback post creation transaction"
                );

            }

        }

        throw err;
    }finally {
        client.release();
    }
    logger.info(
        {
            userId: currentUserId,
            postId: post.id,
            postType: data.post_type,
            mediaCount: data.media?.length ?? 0
        },
        "Post created"
    );

    return post;
        
}

export async function getPostById(postId){
    const post=await findPostById(postId);

    if(!post){
        logger.warn(
            {
                postId
            },
            "Post retrieval failed: post not found"
        );
        throw new NotFoundError("Post not found");
    }
    const media=await findPostMediaByPostId(
        postId
    );

    const mediaWithUrls =
        await Promise.all(
            media.map(
                async({
                    media_key,
                    ...item
                })=>({

                    ...item,

                    media_url:
                        await generateReadUrl(
                            media_key
                        )

                })
            )
        );

    return {
        ...post,

        media:mediaWithUrls
    };
}

export async function deletePost(
    currentUserId,
    postId
){
    const post=await findPostOwner(postId);

    if(!post || post.deleted_at ){
        logger.warn(
            {
                userId: currentUserId,
                postId
            },
            "Post deletion rejected: post not found"
        );
        throw new NotFoundError("Post not found");
    }

    if(
        Number(post.created_by_user_id)
            !==
            Number(currentUserId)
        
    ){
        logger.warn(
            {
                userId: currentUserId,
                postId,
                ownerUserId: post.created_by_user_id
            },
            "Post deletion rejected: user is not the owner"
        );
        throw new ForbiddenError("You are not allowed to delete this post");
    }

    await softDeletePost(postId);

    logger.info(
        {
            userId: currentUserId,
            postId
        },
        "Post deleted"
    );
}

export async  function getUserPosts(userId,page,limit){
    
    const user=await findUserById(userId);
    if(!user){
        logger.warn(
            {
                userId
            },
            "User posts request rejected: user not found"
        );
        throw  new NotFoundError("User not found");
    }
    const offset=(page-1)* limit;

    return await findPostsByUserId(userId,limit,offset);
}

export async function searchPostsService(
    query,
    limit,
    offset
){
    return await searchPosts(
        query,
        limit,
        offset
    );
}
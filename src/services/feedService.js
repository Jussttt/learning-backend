import { findFeedPosts,findPostMediaByPostIds } from "../repositories/postRepository.js";
import { generateReadUrl } from "../storage/s3Service.js";

// export async function getFeed(
//     currentUserId,
//     page,
//     limit
// ){
//     const offset=(page-1)* limit;

//     return await findFeedPosts(
//         currentUserId,
//         limit,
//         offset
//     );
// }

export async function getFeed(
    currentUserId,
    cursor,
    limit
){
    const posts=await findFeedPosts(
        currentUserId,
        cursor,
        limit
    );

    if(posts.length === 0){
        return {
            posts: [],
            nextCursor: null
        };
    }

    let nextCursor=null;

    if(posts.length>0){
        nextCursor=posts[posts.length-1].created_at;
    }

    const postIds=posts.map(
        post=>post.id
    );

    const mediaRows=await findPostMediaByPostIds(
        postIds
    );

    const mediaMap=new Map();

    for(
        const media of mediaRows
    ){
        if(
            !mediaMap.has(
                media.post_id
            )
        ){
                mediaMap.set(
                    media.post_id,
                    []
                );
        }
            
        mediaMap.get(media.post_id).push(media);
        
    }

    const postsWithMedia =
        await Promise.all(
            posts.map(
                async(post)=>{

                    const media =
                        mediaMap.get(
                            post.id
                        ) ?? [];

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

                        media:
                            mediaWithUrls
                    };
                }
            )
        );

        return {
            posts:
                postsWithMedia,

            nextCursor
        };
}
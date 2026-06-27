import { pool } from "../db/pool.js";

export async function findPostTypesByName(name){
    const result=await pool.query(
        `
        SELECT 
            id,
            name
        FROM post_types
        WHERE name=$1
        `,
        [name]
    );

    return result.rows[0] ?? null;
}

export async function createPost(
    client,
    {
        createdByUserId,
        postTypeId,
        locationId,
        caption,
    }){
        const result=
                await client.query(
                    `
                    INSERT INTO posts(
                        created_by_user_id,
                        post_type_id,
                        location_id,
                        caption
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4
                    )
                    RETURNING
                        id,
                        created_by_user_id,
                        post_type_id,
                        location_id,
                        caption,
                        created_at,
                        updated_at
                    `,
                    [
                        createdByUserId,
                        postTypeId,
                        locationId,
                        caption
                    ]
                );
        
        return result.rows[0];
    }



export async function findPostById(postId){
    const result=
        await pool.query(
            `
            SELECT 
                p.id,
                p.caption,
                p.created_at,

                u.id AS user_id,
                u.profile_name,

                pt.name AS post_type

            FROM posts p 

            JOIN app_users u
            ON p.created_by_user_id=u.id

            JOIN post_types pt
            ON p.post_type_id=pt.id

            WHERE p.id=$1
            AND p.deleted_at IS NULL 
            `,
            [postId]
        );

    return result.rows[0]??null;
}


export async function findPostOwner(postId){
    const result=await pool.query(
        `
        SELECT 
            id,
            created_by_user_id,
            deleted_at
        FROM posts
        WHERE id=$1
        `,
        [postId]
    );

    return result.rows[0]??null;
}

export async function softDeletePost(postId){
    await pool.query(
        `
        UPDATE posts
        SET 
            deleted_at=NOW(),
            updated_at=NOW()
        WHERE id=$1
        `,[postId]
    );
}

export async function findPostsByUserId(
        userId,
        limit,
        offset
    ){
    const result =await pool.query(
        `
        SELECT 
            p.id,
            p.caption,
            p.created_at,
            pt.name AS post_types
        FROM posts p

        JOIN post_types pt
        ON p.post_type_id=pt.id

        WHERE p.created_by_user_id=$1
        AND p.deleted_at IS NULL

        ORDER BY p.created_at DESC

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

// export async function findFeedPosts(
//     userId,
//     limit,
//     offset
// ){
//     const result=await pool.query(
//         `
//         SELECT 
//             p.id,
//             p.caption,
//             p.created_at,
//             u.id as user_id,
//             u.profile_name,
//             pt.name AS post_type
//         FROM posts p

//         JOIN app_users u
//             ON p.created_by_user_id=u.id

//         JOIN post_types pt 
//             ON p.post_type_id=pt.id

//         WHERE 
//             p.deleted_at IS NULL

//             AND (


//                 p.created_by_user_id=$1

//                 OR

//                 p.created_by_user_id IN (
//                     SELECT followed_user_id
//                     FROM followers
//                     WHERE following_user_id=$1
//                 )
//             )
//         ORDER BY p.created_at DESC

//         LIMIT $2
//         OFFSET $3
//         `,[
//             userId,
//             limit,
//             offset
//         ]
//     );
//     return result.rows;
// }


export async function findFeedPosts(
    userId,
    cursor,
    limit
){
    const params=[userId];
    let cursorCondition="";

    if(cursor){
        params.push(cursor);

        cursorCondition=
            `
            AND p.created_at<$2
            `;
    }

    params.push(limit);

    const limitParamIndex=params.length;


    const result=await pool.query(
        `
        SELECT 
            p.id,
            p.caption,
            p.created_at,

            u.id AS user_id,
            u.profile_name,
            pt.name AS post_type
        FROM posts p

        JOIN app_users u 
            ON p.created_by_user_id=u.id

        JOIN post_types pt
            ON p.post_type_id=pt.id
        
        WHERE
            p.deleted_at IS NULL

            AND(
                p.created_by_user_id=$1

                OR

                p.created_by_user_id IN (
                    SELECT followed_user_id
                    FROM followers
                    WHERE following_user_id=$1
                )
            )

            ${cursorCondition}

            ORDER BY p.created_at DESC

            LIMIT $${limitParamIndex}
        `
        ,params);

    return result.rows;
}


export async function createPostMedia(
    client,
    mediaRows
){
    const values=[];
    const params=[];

    mediaRows.forEach(
        (
            media,
            index
        )=>{
            const offset=index*6;

            values.push(
                `
                (
                    $${offset+1},
                    $${offset+2},
                    $${offset+3},
                    $${offset+4},
                    $${offset+5},
                    $${offset+6}
                )
                `
            );

            params.push(
                media.postId,
                media.mediaKey,
                media.mediaType,
                media.position,
                media.width,
                media.height

            );
        }
    );

    await client.query(
        `
        INSERT INTO post_media(
            post_id,
            media_key,
            media_type,
            position,
            width,
            height
        )
        VALUES 
        ${values.join(",")}
        `,
        params
    );

}

export async function findPostMediaByPostId(
    postId
){
    const result=await pool.query(
        `
        SELECT 
            id,
            post_id,
            media_key,
            media_type,
            position,
            width,
            height
        FROM post_media
        WHERE post_id=$1
        ORDER BY position
        `,
        [postId]
    );
    return result.rows;
}

export async function findPostMediaByPostIds(
    postIds
){
    const result=
        await pool.query(
            `
            SELECT
                id,
                post_id,
                media_key,
                media_type,
                position,
                width,
                height
            FROM post_media
            WHERE post_id=ANY($1)
            ORDER BY
                post_id,
                position
            `,
            [postIds]
        );

    return result.rows;
}


export async function searchPosts(
    query,
    limit,
    offset
){
    const result= await pool.query(
        `
        SELECT 
            p.id,
            p.caption,
            p.created_at,

            u.id AS user_id,
            u.profile_name,
            u.profile_pic_url,

            ts_rank(
                to_tsvector(
                    'english',
                    COALESCE(p.caption,'')
                ),
                plainto_tsquery(
                    'english',
                    $1
                )
            ) AS rank
        
        FROM posts p

        JOIN app_users u
        ON p.created_by_user_id=u.id

        WHERE
            p.deleted_at IS NULL

        AND

            to_tsvector(
                'english',
                COALESCE(p.caption,'')
            )
            
            @@

            plainto_tsquery(
                'english',
                $1
            )
        ORDER BY 
            rank DESC,
            p.created_at DESC

        LIMIT $2
        OFFSET $3
        `,
        [
            query,
            limit,
            offset
        ]
    );

    return result.rows;
}
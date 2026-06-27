import { pool } from "../db/pool.js";

export async function updateUserProfile(
    userId,
    updates
) {

    const fields = [];

    const values = [];

    let parameterIndex = 1;

    for (
        const [key, value]
        of Object.entries(updates)
    ) {

        fields.push(
            `${key} = $${parameterIndex}`
        );

        values.push(value);

        parameterIndex++;
    }

    fields.push(
        "updated_at = NOW()"
    );

    values.push(userId);

    const query = `
        UPDATE app_users
        SET ${fields.join(", ")}
        WHERE id = $${parameterIndex}
        RETURNING
            id,
            profile_name,
            email,
            first_name,
            last_name,
            bio,
            profile_pic_url,
            is_private,
            updated_at
    `;

    const result =
        await pool.query(
            query,
            values
        );

    return result.rows[0];
}


// export async function searchUsers(
//     query,
//     limit
// ){
//     const result=await pool.query(
//         `
//         SELECT 
//             id,
//             profile_name,
//             first_name,
//             last_name,
//             profile_pic_url,
//             ts_rank(
//                 to_tsvector(
//                     'simple',
//                     COALESCE(profile_name,'')
//                     || ' ' ||
//                     COALESCE(first_name,'')
//                     || ' ' ||
//                     COALESCE(last_name,'')
//                 ),

//                 plainto_tsquery(
//                     'simple',
//                     $1
//                 )
//             ) AS rank
//         FROM app_users

//         WHERE
//             to_tsvector(
//                 'simple',
//                 COALESCE(profile_name,'')
//                 || ' ' ||
//                 COALESCE(first_name,'')
//                 || ' ' ||
//                 COALESCE(last_name,'')
//             )

//             @@
//             plainto_tsquery(
//                 'simple',
//                 $1
//             )
        
//         ORDER BY rank DESC
//         LIMIT $2
//         `,
//         [
//             query,
//             limit
//         ]
//     );
//     return result.rows;
// }

export async function searchUsers(
    query,
    limit
){
    const result=await pool.query(
        `
        SELECT
            id,
            profile_name,
            first_name,
            last_name,
            profile_pic_url,

            GREATEST(
                similarity(profile_name, $1),
                similarity(COALESCE(first_name,''), $1),
                similarity(COALESCE(last_name,''), $1)
            ) AS score

        FROM app_users

        WHERE
            profile_name % $1
            OR first_name % $1
            OR last_name % $1

        ORDER BY score DESC

        LIMIT $2;
        `,
        [
            query,
            limit
        ]
    );

    return result.rows;
}
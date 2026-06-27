import { pool } from "../db/pool.js";

export async function createConversation(
    client ,
    type
){
    const result=await client.query(
        `
        INSERT INTO conversations(
            type
        )
        VALUES ($1)
        RETURNING *
        `,
        [type]
    );

    return result.rows[0];

}

export async function addConversationParticipant(
    client,
    conversationId,
    userId
){
    await client.query(
        `
        INSERT INTO conversation_participants(
            conversation_id,
            user_id
        )
        VALUES (
            $1,
            $2
        )
        `,
        [
            conversationId,
            userId
        ]
    );
}


export async function findDirectConversation(
    userOneId,
    userTwoId
){
    const result=await pool.query(
        // `
        // SELECT c*
        // FROM conversations c

        // JOIN conversation_participants cp1
        // ON cp1.conversation_id=c.id

        // JOIN conversation_participants cp2
        // ON cp2.conversation_id=c.id

        // WHERE 
        //     c.type='direct'
        //     AND cp1.user_id=$1
        //     AND CP2.user_id=$2
        // `
        `
        SELECT c.*
        FROM conversations c
        JOIN conversation_participants cp
            ON cp.conversation_id = c.id
        WHERE c.type = 'direct'
            AND cp.user_id IN ($1, $2)
        GROUP BY c.id
        HAVING COUNT(DISTINCT cp.user_id) = 2
            AND (
                SELECT COUNT(*)
                FROM conversation_participants cp2
                WHERE cp2.conversation_id = c.id
            ) = 2
        `
        ,
        [
            userOneId,
            userTwoId
        ]

    );
    return result.rows[0];
}

export async function findUserConversations(userId){
    const result=await pool.query(
        `
        SELECT 
            c.id AS conversation_id,
            c.last_message_at,
            u.id AS participant_id,
            u.profile_name
        FROM conversations c

        JOIN conversation_participants cp_me
            ON cp_me.conversation_id=c.id
        JOIN conversation_participants cp_other
            ON cp_other.conversation_id=c.id
        JOIN app_users u 
            ON u.id=cp_other.user_id

        WHERE 
            cp_me.user_id=$1
            AND cp_other.user_id <> $1
            AND c.type='direct'
        ORDER BY
            c.last_message_at DESC NULLS LAST
        `,
        [userId]
    );
    return result.rows;
} 



export async function isConversationParticipant(
    conversationId,
    userId
){
    const result=await pool.query(
        `
        SELECT EXISTS(
            SELECT 1 
            FROM conversation_participants
            WHERE conversation_id=$1
            AND user_id=$2
        ) AS exists
        `,[
            conversationId,
            userId
        ]
    );

    return result.rows[0].exists;
}

export async function createMessage(
    client,
    conversationId,
    senderUserId,
    messageText
){
    const result=await client.query(
        `
        INSERT INTO messages(
            conversation_id,
            sender_user_id,
            message_text
        )
        VALUES(
            $1,
            $2,
            $3
        )
        RETURNING * 
        `,
        [
            conversationId,
            senderUserId,
            messageText

        ]
    );
    return result.rows[0];
}


export async function updateConversationLastMessagesAt(
    client,
    conversationId
){
    await client.query(
        `
        UPDATE conversations
        SET last_message_at=NOW()
        WHERE id=$1
        `,
        [conversationId]
    );
}

export async function findConversationMessages(
    conversationId,
    cursor,
    limit

){
    const params=[conversationId];
    let cursorCondition="";
    if(cursor){
        params.push(cursor);
        cursorCondition=
        `
        AND m.id< $2
        `;
    }
    params.push(limit);

    const limitIndex=params.length;

    const result=await pool.query(
        `
        SELECT 
            m.id,
            m.sender_user_id,
            m.message_text,
            m.created_at
        FROM messages m

        WHERE 
            m.conversation_id=$1

            ${cursorCondition}
        ORDER BY 
            m.id DESC
        LIMIT $${limitIndex}
        `,
        params
    );
    
    return result.rows;
}

export async function findConversationParticipants(
    conversationId
){
    const result=await pool.query(
        `
        SELECT 
            user_id
        FROM conversation_participants
        WHERE conversation_id=$1
        `,
        [conversationId]
    );

    return result.rows;
}

export async function createMessageReceipts(
    client,
    messageId,
    recipientIds
){
    if(recipientIds.length===0) return;

    const values=[];
    const params=[messageId];

    recipientIds.forEach(
        (userId,index)=>{
            values.push(
                `($1,$${index+2})`
            );
            params.push(userId);
        }
    );
    
    
    await client.query(
        `
        INSERT INTO message_receipts(
            message_id,
            user_id
        )
        VALUES
        ${values.join(",")}
        `,
        params
    );
}

export async function markConversationMessagesRead(
    conversationId,
    userId
){
    
    await pool.query(
        `
        UPDATE message_receipts mr
        SET read_at=NOW()

        FROM messages m

        WHERE mr.message_id=m.id

        AND m.conversation_id=$1

        AND mr.user_id=$2

        AND mr.read_at IS NULL
        `,
        [
            conversationId,
            userId
        ]
    );
}

export async function findConversationUnreadCounts(
    userId
){
    const result =
        await pool.query(
            `
            SELECT
                m.conversation_id,

                COUNT(*)::INT
                    AS unread_count

            FROM message_receipts mr

            JOIN messages m
                ON mr.message_id = m.id

            WHERE
                mr.user_id = $1

                AND mr.read_at IS NULL

            GROUP BY
                m.conversation_id
            `,
            [userId]
        );
    console.log(result.rows);

    return result.rows;
}
import { NotFoundError } from "../errors/NotFoundError.js";
import { findUserById } from "../repositories/authRepository.js";
import { findDirectConversation,createConversation ,addConversationParticipant,findUserConversations, isConversationParticipant, createMessage, updateConversationLastMessagesAt, findConversationMessages, findConversationParticipants, createMessageReceipts,markConversationMessagesRead,findConversationUnreadCounts} from "../repositories/conversationRepository.js";
import { ConflictError } from "../errors/ConflictError.js";
import { pool } from "../db/pool.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { eventBus } from "../events/eventBus.js";


export async function createDirectConversation(
    currentUserId,
    participantId
){
    if(
        Number(currentUserId) ===
        Number(participantId)
    ){
        throw new ConflictError(
            "You cannot create a conversation with yourself"
        );
    }

    const participant=await findUserById(participantId);

    if(!participant) throw new NotFoundError("User not found");

    const existingConversation=await findDirectConversation(
        currentUserId,
        participantId
    );

    if(existingConversation) return existingConversation;

    const client =await pool.connect();

    try{
        await client.query(
            "BEGIN"
        );

        const conversation=await createConversation(
            client,
            "direct"
        );

        await addConversationParticipant(
            client,
            conversation.id,
            currentUserId
        );

        await addConversationParticipant(
            client,
            conversation.id,
            participantId
        );

        await client.query(
            "COMMIT"
        );

        return conversation;

    }catch(error){
        await client.query(
            "ROLLBACK"
        );
        throw error;
    }
    finally{
        client.release();
    }

}



export async function getUserConversations(
    currentUserId
){
    return await findUserConversations(
        currentUserId
    );
}

export async function sendMessage(
    currentUserId,
    conversationId,
    messageText
){
    
    const isParticipant=await isConversationParticipant(
        conversationId,
        currentUserId
    );
    if(!isParticipant) throw new ForbiddenError("You are not a participant of this conversation");

    const client=await pool.connect();

    try{
        await client.query("BEGIN");

        const message=await createMessage(
            client,
            conversationId,
            currentUserId,
            messageText
        );
        const participants=await findConversationParticipants(
            conversationId
        );

        const recipientIds=
            participants
                .map(
                    p=>Number(p.user_id)
                )
                .filter(
                    id=>id!==Number(currentUserId)
                );
        
        
        await createMessageReceipts(
            client,
            message.id,
            recipientIds
        );

        await updateConversationLastMessagesAt(
            client,
            conversationId
        );

        await client.query("COMMIT");

        eventBus.emit(
            "message.created",
            {
                message,
                conversationId
            }
        );

        return message;
    }catch(error){
        await client.query("ROLLBACK");
        throw error;
    }finally{
        client.release();
    }
}

export async function conversationMessages(
    currentUserId,
    conversationId,
    cursor,
    limit
){
    const isParticipant =
        await isConversationParticipant(
            conversationId,
            currentUserId
        );
    if(!isParticipant ) throw new ForbiddenError("You are not a member of this conversation");

    const messages=await findConversationMessages(
        conversationId,
        cursor,
        limit
    );

    let nextCursor=null;

    if(messages.length>0){
        nextCursor=messages[messages.length-1].id;
    }
    
    return {
        messages,
        nextCursor,
    };
}

export async function markConversationRead(
    currentUserId,
    conversationId
){
    const isParticipant =
        await isConversationParticipant(
            conversationId,
            currentUserId
        );

    if(!isParticipant){
        throw new ForbiddenError(
            "You are not a participant in this conversation"
        );
    }

    await markConversationMessagesRead(
        conversationId,
        currentUserId
    );

    eventBus.emit(
        "conversation.read",
        {
            conversationId,
            userId: currentUserId
        }
    );
}

export async function getUnreadCounts(
    currentUserId
){
    return await findConversationUnreadCounts(
        currentUserId
    );
}
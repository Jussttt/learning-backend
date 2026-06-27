
import {
    createDirectConversation,getUserConversations,
    sendMessage,conversationMessages,markConversationRead as markConversationReadService,
    getUnreadCounts as getUnreadCountsService
} from "../../services/conversationService.js";

export async function createConversation(
    req,
    res
){
    const conversation =
        await createDirectConversation(
            req.user.userId,
            req.validatedBody.participant_id
        );

    return res.status(201).json({
        success: true,
        data: conversation,
    });
}



export async function getConversations(
    req,
    res
){
    const conversations =
        await getUserConversations(
            req.user.userId
        );

    return res.status(200).json({
        success: true,
        data: conversations,
    });
}

export async function createMessage(
    req,
    res
){
    const message=await sendMessage(
        req.user.userId,
        req.validatedParams.conversationId,
        req.validatedBody.message_text
    );

    return res.status(201).json({
        success:  true,
        data: message,
    });
}

export async function getMessages(
    req,
    res
){
    const {
        cursor,
        limit
    } = req.validatedQuery;

    const result =
        await conversationMessages(
            req.user.userId,
            req.validatedParams.conversationId,
            cursor,
            limit
        );

    return res.status(200).json({
        success: true,
        data: result.messages,
        nextCursor:
            result.nextCursor,
    });
}

export async function markConversationRead(
    req,
    res
){
    await markConversationReadService(
        req.user.userId,
        req.validatedParams.conversationId
    );

    return res.status(200).json({
        success: true
    });
}

export async function getUnreadCounts(
    req,
    res
){
    const counts =
        await getUnreadCountsService(
            req.user.userId
        );

    return res.status(200).json({
        success: true,
        data: counts,
    });
}
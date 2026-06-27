import { Router } from "express";

import { authenticate }
from "../../middleware/authenticate.js";

import { validate }
from "../../middleware/validate.js";

import { asyncHandler }
from "../../utils/asyncHandler.js";

import {
    createConversation,createMessage,getConversations,getMessages,markConversationRead,
    getUnreadCounts
} from "../controllers/conversationController.js";

import {
    conversationIdParamsSchema,
    createConversationSchema,
    createMessageSchema,messageQuerySchema,
    
} from "../validators/conversationValidator.js";

const router = Router();

router.post(
    "/",
    authenticate,
    validate(
        createConversationSchema
    ),
    asyncHandler(
        createConversation
    )
);

router.get(
    "/",
    authenticate,
    asyncHandler(
        getConversations
    )
);

router.post(
    "/:conversationId/messages",
    authenticate,
    validate(
        conversationIdParamsSchema,
        "params"
    ),
    validate(createMessageSchema),
    asyncHandler(
        createMessage
    )
);

router.get(
    "/:conversationId/messages",
    authenticate,
    validate(
        conversationIdParamsSchema,
        "params"
    ),
    validate(
        messageQuerySchema,
        "query"
    ),
    asyncHandler(
        getMessages
    )
);

router.post(
    "/:conversationId/read",
    authenticate,
    validate(
        conversationIdParamsSchema,
        "params"
    ),
    asyncHandler(
        markConversationRead
    )
);

router.get(
    "/unread-counts",
    authenticate,
    asyncHandler(
        getUnreadCounts
    )
);

export default router;
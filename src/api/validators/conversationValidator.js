import {z} from "zod";

export const createConversationSchema=
        z.object({
            participant_id: z.coerce
                            .number()
                            .int()
                            .positive()
        });

export const createMessageSchema=
        z.object({
            message_text: z
                    .string()
                    .trim()
                    .min(1)
                    .max(5000)
        });

export const conversationIdParamsSchema=
        z.object({
            conversationId:z.coerce
                            .number()
                            .int()
                            .positive()
        });

export const messageQuerySchema=
    z.object({
        cursor: z.coerce
            .number()
            .int()
            .positive()
            .optional(),
        
        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(50)
            .default(20),
    });


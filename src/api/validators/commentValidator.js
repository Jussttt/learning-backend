import {z} from "zod";

export const createCommentSchema=
    z.object({
        content: z
            .string()
            .trim()
            .min(1,"Comment cannot be empty")
            .max(2200,"Comment too long"),
    });

export const commentIdParamsSchema =
    z.object({
        commentId: z.coerce
            .number()
            .int()
            .positive(),
    });
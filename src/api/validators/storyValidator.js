import {z} from "zod";

export const createStorySchema=
    z.object({
        media_type: z
                    .enum([
                        "image",
                        "video",
                    ]),
        
        media_key: z
            .string()
            .min(1),

        caption: z
                .string()
                .max(500,"Caption cannot exceed 500 characters")
                .optional(),


    });


export const storyIdParamsSchema =
    z.object({
        storyId: z.coerce
            .number()
            .int()
            .positive(),
    });
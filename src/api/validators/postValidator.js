import { z } from "zod";

export const createPostSchema=
    z.object({
        caption:z
                .string()
                .trim()
                .max(2200)
                .optional(),
        
        post_type: z
                .enum([
                    "image",
                    "video"
                ]),
        
        location_id: z
                .coerce
                .number()
                .int()
                .positive()
                .optional(),

        media: z
                .array(
                    z.object({
                        media_key: z
                            .string()
                            .trim()
                            .min(1),

                        media_type: z
                            .enum([
                                "image",
                                "video"
                            ]),

                        position: z
                            .number()
                            .int()
                            .nonnegative(),

                        width: z
                            .number()
                            .int()
                            .positive(),

                        height: z
                            .number()
                            .int()
                            .positive()
                    })
                )
                .default([])

    });

export const  postIdParamsSchema=
    z.object({
        postId: z
                .coerce
                .number()
                .int()
                .positive(),
    });



export const searchPostsSchema =
    z.object({

        q:
            z.string()
            .trim()
            .min(1),

        limit:
            z.coerce
            .number()
            .int()
            .positive()
            .max(20)
            .default(10),

        offset:
            z.coerce
            .number()
            .int()
            .min(0)
            .default(0)
    });
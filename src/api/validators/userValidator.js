import { z } from "zod";

export const updateProfileSchema =
    z.object({

        first_name: z
            .string()
            .trim()
            .max(50)
            .optional(),

        last_name: z
            .string()
            .trim()
            .max(50)
            .optional(),

        bio: z
            .string()
            .trim()
            .max(150)
            .optional(),

        is_private: z
            .boolean()
            .optional(),

    })
    .refine(
        (data)=> Object.keys(data).length>0,
        {
            message: "At least one field must be provided",
        }
    );

export const userIdParamsSchema =
    z.object({
        userId: z.coerce
            .number()
            .int()
            .positive(),
    });

export const paginationQuerySchema=
    z.object({
        page: z.coerce
                .number()
                .int()
                .positive()
                .default(1),
        
        limit: z.coerce 
                .number()
                .int()
                .positive()
                .max(100)
                .default(20),
    });


export const searchUsersSchema =
    z.object({
        q:
            z.string()
             .trim()
             .min(1),

        limit:
            z.coerce.number()
             .int()
             .positive()
             .max(20)
             .default(10)
    });
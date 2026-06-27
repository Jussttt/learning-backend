import z from "zod";

export const feedQuerySchema=
    z.object({
        cursor: z
            .string()
            .datetime()
            .optional(),
        
        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(50)
            .default(20),
    });
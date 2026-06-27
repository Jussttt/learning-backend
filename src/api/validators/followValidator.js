import { z } from "zod";

export const followParamsSchema =
    z.object({

        userId: z
            .coerce
            .number()
            .int()
            .positive(),

    });
import {z} from "zod";

export const generateUploadUrlSchema=
    z.object({
        contentType:
            z.string()
    });
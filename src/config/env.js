import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();


const envSchema =z.object({
    NODE_ENV:z.enum(["development","test","production"]),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL:z.string().url(),
    JWT_SECRET:z.string().min(32),
    JWT_EXPIRES_IN:z.string().min(1).default("7d"),
    BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
    LOG_LEVEL: z.enum([
        "fatal",
        "error",
        "warn",
        "info",
        "debug",
        "trace"
    ]).default("info"),
    REDIS_URL:z.string().url(),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    S3_BUCKET_NAME: z.string().min(1),
});

const parsedEnv=envSchema.safeParse(process.env);

if(!parsedEnv.success){
    console.error(
        "❌ Invalid environment variables:\n",
        JSON.stringify(parsedEnv.error.flatten().fieldErrors,null,2)
    );
    process.exit(1);
}

export const env=Object.freeze(parsedEnv.data);

export const isDev= env.NODE_ENV === "development";
export const isProd= env.NODE_ENV === "production";
export const isTest= env.NODE_ENV === "test";

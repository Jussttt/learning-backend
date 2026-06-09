import pg from "pg";

import { env } from "../config/env.js";
import { DATABASE_CONFIG } from "../config/database.js";
import { logger } from "../logger/logger.js";

const { Pool} =pg;

export const pool=new Pool({
    connectionString: env.DATABASE_URL,
    
    max: DATABASE_CONFIG.MAX_CONNECTIONS,

    idleTimeoutMillis:DATABASE_CONFIG.IDLE_TIMEOUT_MS,

    connectionTimeoutMillis:DATABASE_CONFIG.CONNECTION_TIMEOUT_MS,
});

pool.on("connect", () => {
    logger.debug(
        { component: "postgres" },
        "New PostgreSQL connection established"
    );
});

pool.on("error", (err) => {
    logger.error(
        {
            component: "postgres",
            err,
        },
        "Unexpected PostgreSQL pool error"
    );
});
export async function verifyDatabase(){
    const result= await pool.query(
        "SELECT NOW()"
    );

    return result.rows[0];
}
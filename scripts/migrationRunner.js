import { pool } from "../src/db/pool.js";
import { logger } from "../src/logger/logger.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";





export async function runMigrations(){
    try{
        logger.info("Starting migration runner");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations(
                version VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            );    
        `);

        logger.info("schema_migrations table ready");

        const __filename = fileURLToPath(import.meta.url);

        const __dirname = path.dirname(__filename);

        const migrationsDir = path.join(
            __dirname,
            "migrations"
        );
        const files = (await fs.readdir(migrationsDir))
            .filter(file => file.endsWith(".sql"))
            .sort();

        logger.info(
            { files },
            "Migration files discovered"
        );

        const appliedResult = await pool.query(`
            SELECT version
            FROM schema_migrations
        `);

        const appliedMigrations = new Set(
            appliedResult.rows.map(
                row => row.version
            )
        );

        logger.info(
            {
                appliedMigrations: [
                ...appliedMigrations
                ]
            },
            "Applied migrations loaded"
        );

        const pendingMigrations =
        files.filter(
            file =>
            !appliedMigrations.has(file)
        );


        logger.info(
            {
                pendingMigrations
            },
            "Pending migrations determined"
        );

        for (const migration of pendingMigrations) {

            logger.info(
                { migration },
                "Applying migration"
            );

            const migrationPath = path.join(
                migrationsDir,
                migration
            );

            const sql = await fs.readFile(
                migrationPath,
                "utf8"
            );

            const client = await pool.connect();

            try {

                await client.query("BEGIN");

                await client.query(sql);

                await client.query(
                    `
                    INSERT INTO schema_migrations(version)
                    VALUES ($1)
                    `,
                    [migration]
                );

                await client.query("COMMIT");

                logger.info(
                    { migration },
                    "Migration applied successfully"
                );

            } catch (err) {

                await client.query("ROLLBACK");

                logger.error(
                    {
                    err,
                    migration,
                    },
                    "Migration failed"
                );

                throw err;

            } finally {

                client.release();

            }

        }


    } catch(err){
        logger.fatal(
            {err},
            "Migration runner failed"
        )
        throw err;
    } finally {
        await pool.end();

        logger.info("Database pool closed");
    }
}
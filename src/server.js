import { createApp } from "./app.js";
import { logger } from "./logger/logger.js";
import { env } from "./config/env.js";
import { verifyDatabase } from "./db/pool.js";
import http from "http";

import { createSocketServer } from "./socket/socketServer.js";
import { cacheClient } from "./cache/cacheServer.js";
import { registerRecurringJobs } from "./jobs/registerReccuringJobs.js";

import { registerShutdownHandlers } from "./shutdown/gracefulShutdown.js";

const app = createApp();

const server = http.createServer(app);

const io = await createSocketServer(server);

async function startServer() {

    try{

        await verifyDatabase();

        logger.info(
            { component:"postgres" },
            "Database verification successful"
        );

        await cacheClient.connect();

        logger.info(
            "Redis Cache Connected"
        );

        await registerRecurringJobs();

        server.listen(
            env.PORT,
            ()=>{
                logger.info(
                    { port:env.PORT },
                    "Server started"
                );
            }
        );

        registerShutdownHandlers({
            server,
            io
        });

    }catch(err){

        logger.fatal(
            { err },
            "Application startup failed"
        );

        process.exit(1);

    }

}

startServer();
import { cacheClient } from "../cache/cacheServer.js";
import { pool } from "../db/pool.js";
import { logger } from "../logger/logger.js";



let isShuttingDown=false;

export function registerShutdownHandlers({
    server,
    io
}){
    async function shutdown(signal){

        if(isShuttingDown){
            return;
        }

        isShuttingDown = true;

        logger.info(
            { signal },
            "Shutdown initiated"
        );

        const timeout = setTimeout(()=>{

            logger.error(
                "Forced shutdown"
            );

            process.exit(1);

        },10000);

        try{

            await new Promise(
                resolve =>
                    server.close(resolve)
            );

            logger.info(
                "HTTP server closed"
            );

            await Promise.allSettled([

                pool.end(),

                cacheClient.quit(),

                io.close()

            ]);

            logger.info(
                "Resources closed"
            );

            clearTimeout(timeout);

            process.exit(0);

        }catch(err){

            logger.error(
                { err },
                "Shutdown failed"
            );

            clearTimeout(timeout);

            process.exit(1);

        }

    }

    process.on(
        "SIGINT",
        ()=>shutdown("SIGINT")
    );

    process.on(
        "SIGTERM",
        ()=>shutdown("SIGTERM")
    );

    process.on(
        "unhandledRejection",
        reason=>{

            logger.fatal(
                { reason },
                "Unhandled Promise Rejection"
            );

            shutdown(
                "UnhandledRejection"
            );

        }
    );

    process.on(
        "uncaughtException",
        err=>{

            logger.fatal(
                { err },
                "Uncaught Exception"
            );

            shutdown(
                "UncaughtException"
            );

        }
    );

    
}
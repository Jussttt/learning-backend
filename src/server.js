import { createApp } from "./app.js";
import { logger } from "./logger/logger.js";
import { env } from "./config/env.js";
import { verifyDatabase , pool } from "./db/pool.js";


const app = createApp();

async function startServer() {
  try {
    await verifyDatabase();

    logger.info(
      { component: "postgres" },
      "Database verification successful"
    );

  

    const server = app.listen(
      env.PORT,
      () => {
        logger.info(
          { port: env.PORT },
          "Server started"
        );
      }
    );


    logger.info(
      "Registering shutdown handlers"
    );


    

    process.on("SIGINT", () => {
      shutdown(server);
    });

    process.on(
      "SIGTERM",
      () => shutdown(server)
    );

    process.on("unhandledRejection",(reason)=>{
      logger.fatal({ reason },"Unhandled Promise Rejection");
      shutdown(server);
    });


    process.on(
      "uncaughtException",
      (err) => {
        logger.fatal(
          { err },
          "Uncaught Exception"
        );

        shutdown(server);
      }
    );

    return server;

  } catch (err) {
    logger.fatal(
      { err },
      "Application startup failed"
    );

    process.exit(1);
  }
}


async function shutdown(server){
  
  logger.info("Shutdown signal recieved");

  server.close(async ()=>{
    logger.info("HTTP server closed");


    try{
      await pool.end();

      logger.info("PostgreSQL pool closed");
      process.exit(0);
    }
    catch(err){
      logger.error({err},"Error clossing PostgreSQL pool");

      process.exit(1);
    }
  });

  
}

startServer();
import { logger } from "../src/logger/logger.js";
import { runMigrations } from "./migrationRunner.js";

try {
  await runMigrations();

  logger.info(
    "Migration execution completed"
  );

  process.exit(0);

} catch (err) {
  logger.fatal(
    { err },
    "Migration execution failed"
  );

  process.exit(1);
}
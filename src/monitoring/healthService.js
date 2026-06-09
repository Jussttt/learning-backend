import { pool }
from "../db/pool.js";

export async function
checkDatabaseHealth() {

  await pool.query("SELECT 1");

  return "connected";
}
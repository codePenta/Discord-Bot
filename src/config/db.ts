import { createPool } from "mariadb";
import { env } from "./env";

export const pool = createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  connectionLimit: 5,
  connectTimeout: 10000,
  acquireTimeout: 10000,
});
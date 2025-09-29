const { Client } = require("pg");
require("dotenv").config();

let config;

if (process.env.PG_EXTERNAL_URL) {
  // Local dev connecting to Render DB
  config = {
    connectionString: process.env.PG_EXTERNAL_URL,
    ssl: { rejectUnauthorized: false },
  };
} else {
  // Local DB
  config = {
    user: process.env.PG_LOCAL_USER,
    host: process.env.PG_LOCAL_HOST,
    database: process.env.PG_LOCAL_DATABASE,
    password: process.env.PG_LOCAL_PASSWORD,
    port: process.env.PG_LOCAL_PORT,
  };
}
const db = new Client(config);

db.connect()
  .then(() => console.log("✅ DB connected successfully"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = db;

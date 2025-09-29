const { Client } = require("pg");

const isLocal = process.env.USE_LOCAL_DB === "true";

const db = new Client(
  isLocal
    ? {
        user: process.env.PG_LOCAL_USER,
        host: process.env.PG_LOCAL_HOST,
        database: process.env.PG_LOCAL_DATABASE,
        password: process.env.PG_LOCAL_PASSWORD,
        port: process.env.PG_LOCAL_PORT,
      }
    : {
        connectionString: process.env.PG_EXTERNAL_URL,
        ssl: { rejectUnauthorized: false },
      }
);

db.connect()
  .then(() => console.log("✅ DB connected successfully"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = db;

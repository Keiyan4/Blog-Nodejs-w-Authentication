const { Client } = require("pg");

const connectionString = process.env.PG_EXTERNAL_URL;

if (!connectionString) {
  console.error("❌ PG_EXTERNAL_URL is not defined in Environment Variables");
  process.exit(1);
}

const db = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

db.connect()
  .then(() => console.log("✅ DB connected successfully to Render Postgres"))
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

module.exports = db;

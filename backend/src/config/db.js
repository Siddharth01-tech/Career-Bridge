require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || "postgres",
    password: String(process.env.DB_PASSWORD || ""),
    database: process.env.DB_NAME || "career_bridge_db"
});

pool.on("connect", () => {
    console.log("PostgreSQL connected");
});

module.exports = pool;
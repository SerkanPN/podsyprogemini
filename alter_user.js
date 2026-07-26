import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
    try {
        await pool.query('ALTER USER podsypro_v03serkan SET search_path TO podsypro_v03serkan;');
        console.log("Success! Altered user default search path.");
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

run();

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || "";
const cleanUrl = dbUrl.replace(/[?&]schema=[^&]+/, "").replace(/\?$/, "");
const pool = new pg.Pool({ connectionString: cleanUrl });

async function check() {
  try {
    const users = await pool.query(`SELECT * FROM "podsypro_v03serkan"."users"`);
    const shops = await pool.query(`SELECT * FROM "podsypro_v03serkan"."shops"`);
    const listings = await pool.query(`SELECT count(*) FROM "podsypro_v03serkan"."listings"`);
    
    console.log("=== USERS ===");
    console.log(JSON.stringify(users.rows, null, 2));
    
    console.log("=== SHOPS ===");
    console.log(JSON.stringify(shops.rows, null, 2));
    
    console.log("=== LISTINGS COUNT ===");
    console.log(listings.rows[0].count);

    // Also check if any tables like receipts, reviews exist
    const tables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='podsypro_v03serkan'`);
    console.log("=== TABLES IN SCHEMA ===");
    console.log(tables.rows.map(r => r.table_name));
  } catch (e) {
    console.error("Inspect error:", e);
  } finally {
    await pool.end();
  }
}

check();

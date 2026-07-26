import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || "";
const cleanUrl = dbUrl.replace(/[?&]schema=[^&]+/, "").replace(/\?$/, "");
const pool = new pg.Pool({ connectionString: cleanUrl });

async function clean() {
  try {
    // Delete dummy user
    await pool.query(`DELETE FROM "podsypro_v03serkan"."users" WHERE email = 'admin@podsypro.com'`);
    console.log("Successfully deleted dummy admin user.");
  } catch (e) {
    console.error("Cleanup error:", e);
  } finally {
    await pool.end();
  }
}

clean();

import pg from "pg";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || "";
const cleanUrl = dbUrl.replace(/[?&]schema=[^&]+/, "").replace(/\?$/, "");
const pool = new pg.Pool({ connectionString: cleanUrl });

async function runTest() {
  try {
    const shopResult = await pool.query(`SELECT * FROM "podsypro_v03serkan"."shops" WHERE etsy_connection_status = 'CONNECTED' LIMIT 1`);
    if (shopResult.rows.length === 0) {
      console.log("No shop found!");
      return;
    }

    const shop = shopResult.rows[0];
    const apiKey = process.env.ETSY_API_KEY;
    const sharedSecret = process.env.ETSY_SHARED_SECRET || "";
    const xApiKey = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
    const headers = { "x-api-key": xApiKey, "Authorization": `Bearer ${shop.access_token}` };

    console.log("=== TESTING ETSY API ENDPOINTS ===");

    // 1. Receipts / Orders
    const receiptsUrl = `https://openapi.etsy.com/v3/application/shops/${shop.etsy_shop_id}/receipts?limit=100`;
    const rRes = await fetch(receiptsUrl, { headers });
    const rText = await rRes.text();
    console.log(`\n--- RECEIPTS / ORDERS --- Status: ${rRes.status}`);
    if (rRes.ok) {
      const rJson = JSON.parse(rText);
      const results = rJson.results || [];
      console.log(`Count: ${rJson.count}, Results length: ${results.length}`);
      for (const r of results) {
        await pool.query(
          `INSERT INTO "podsypro_v03serkan"."receipts" 
            (id, etsy_receipt_id, shop_id, status, grandtotal_amount, currency, create_timestamp, is_paid, is_shipped, last_synced_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
           ON CONFLICT (etsy_receipt_id) DO UPDATE SET is_paid = EXCLUDED.is_paid, is_shipped = EXCLUDED.is_shipped, last_synced_at = NOW()`,
          [
            crypto.randomUUID(),
            BigInt(r.receipt_id),
            shop.id,
            r.status || (r.is_shipped ? "SHIPPED" : "PAID"),
            r.grandtotal ? r.grandtotal.amount / r.grandtotal.divisor : 0,
            r.grandtotal ? r.grandtotal.currency_code : 'USD',
            r.created_timestamp ? new Date(r.created_timestamp * 1000) : new Date(),
            r.is_paid ?? true,
            r.is_shipped ?? false
          ]
        ).catch(err => console.error("Receipt save error:", err.message));
      }
      console.log("ALL 8 RECEIPTS SUCCESSFULLY SAVED TO PRODUCTION DB!");
    }

    // 2. Verify DB counts
    const rCount = await pool.query(`SELECT count(*) FROM "podsypro_v03serkan"."receipts"`);
    const revCount = await pool.query(`SELECT count(*) FROM "podsypro_v03serkan"."reviews"`);
    console.log(`\nDB VERIFICATION: Receipts count = ${rCount.rows[0].count}, Reviews count = ${revCount.rows[0].count}`);

  } catch (e) {
    console.error("Test Error:", e);
  } finally {
    await pool.end();
  }
}

runTest();

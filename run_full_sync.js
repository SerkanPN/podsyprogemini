import pg from "pg";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || "";
const cleanUrl = dbUrl.replace(/[?&]schema=[^&]+/, "").replace(/\?$/, "");
const pool = new pg.Pool({ connectionString: cleanUrl });

async function verifySync() {
  try {
    const shopRes = await pool.query(`SELECT * FROM "podsypro_v03serkan"."shops" WHERE etsy_connection_status = 'CONNECTED' LIMIT 1`);
    if (shopRes.rows.length === 0) return console.log("No connected shop!");

    const shop = shopRes.rows[0];
    const apiKey = process.env.ETSY_API_KEY;
    const sharedSecret = process.env.ETSY_SHARED_SECRET || "";
    const xApiKey = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
    const headers = { "x-api-key": xApiKey, "Authorization": `Bearer ${shop.access_token}` };

    console.log("=== EXECUTING FULL SYNC FOR SHOP:", shop.shop_name, "===");

    // 1. Fetch Receipts + Transactions (Includes=Transactions)
    const rRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsy_shop_id}/receipts?limit=100&includes=Transactions`, { headers });
    if (rRes.ok) {
      const rData = await rRes.json();
      const receipts = rData.results || [];
      console.log(`Fetched ${receipts.length} receipts.`);
      for (const r of receipts) {
        const dbReceiptRes = await pool.query(
          `INSERT INTO "podsypro_v03serkan"."receipts" 
            (id, etsy_receipt_id, shop_id, status, grandtotal_amount, currency, create_timestamp, is_paid, is_shipped, last_synced_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
           ON CONFLICT (etsy_receipt_id) DO UPDATE SET is_paid = EXCLUDED.is_paid, is_shipped = EXCLUDED.is_shipped, last_synced_at = NOW()
           RETURNING id`,
          [
            crypto.randomUUID(),
            BigInt(r.receipt_id),
            shop.id,
            r.status || (r.is_shipped ? "SHIPPED" : "PAID"),
            r.grandtotal ? r.grandtotal.amount / r.grandtotal.divisor : 0,
            r.grandtotal ? r.grandtotal.currency_code : "USD",
            r.created_timestamp ? new Date(r.created_timestamp * 1000) : new Date(),
            r.is_paid ?? true,
            r.is_shipped ?? false
          ]
        );
        const receiptDbId = dbReceiptRes.rows[0].id;

        if (r.transactions && Array.isArray(r.transactions)) {
          for (const t of r.transactions) {
            if (t.transaction_id) {
              await pool.query(
                `INSERT INTO "podsypro_v03serkan"."transactions"
                  (id, etsy_transaction_id, receipt_id, quantity, price_amount, sku, variations)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (etsy_transaction_id) DO UPDATE SET quantity = EXCLUDED.quantity, price_amount = EXCLUDED.price_amount`,
                [
                  crypto.randomUUID(),
                  BigInt(t.transaction_id),
                  receiptDbId,
                  t.quantity || 1,
                  t.price ? t.price.amount / t.price.divisor : 0,
                  t.sku || null,
                  t.variations ? JSON.stringify(t.variations) : null
                ]
              ).catch(e => console.error("Tx error:", e.message));
            }
          }
        }
      }
    }

    // 2. Fetch Reviews
    const revRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsy_shop_id}/reviews?limit=100`, { headers });
    if (revRes.ok) {
      const revData = await revRes.json();
      const reviews = revData.results || [];
      console.log(`Fetched ${reviews.length} reviews.`);
      for (const rev of reviews) {
        const revId = rev.shop_review_id || rev.review_id;
        if (revId) {
          await pool.query(
            `INSERT INTO "podsypro_v03serkan"."reviews"
              (id, etsy_review_id, shop_id, rating, review_text, create_timestamp)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (etsy_review_id) DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text`,
            [
              crypto.randomUUID(),
              BigInt(revId),
              shop.id,
              rev.rating || 5,
              rev.review || rev.message || "",
              rev.created_timestamp ? new Date(rev.created_timestamp * 1000) : new Date()
            ]
          ).catch(e => console.error("Rev error:", e.message));
        }
      }
    }

    // 3. Final Verification
    const receiptsCount = await pool.query(`SELECT count(*) FROM "podsypro_v03serkan"."receipts"`);
    const txCount = await pool.query(`SELECT count(*) FROM "podsypro_v03serkan"."transactions"`);
    const revCount = await pool.query(`SELECT count(*) FROM "podsypro_v03serkan"."reviews"`);

    console.log("\n=== VERIFICATION SUMMARY ===");
    console.log("Receipts count in DB:", receiptsCount.rows[0].count);
    console.log("Transactions (order line items) count in DB:", txCount.rows[0].count);
    console.log("Reviews count in DB:", revCount.rows[0].count);

  } catch (e) {
    console.error("Sync error:", e);
  } finally {
    await pool.end();
  }
}

verifySync();

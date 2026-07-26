import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || "";
const cleanUrl = dbUrl.replace(/[?&]schema=[^&]+/, "").replace(/\?$/, "");
const pool = new pg.Pool({ connectionString: cleanUrl });

async function syncExisting() {
  try {
    // Get existing connected shop
    const shopResult = await pool.query(`SELECT * FROM "podsypro_v03serkan"."shops" WHERE etsy_connection_status = 'CONNECTED' LIMIT 1`);
    if (shopResult.rows.length === 0) {
      console.log("No connected shop found in database.");
      return;
    }

    const shop = shopResult.rows[0];
    const apiKey = process.env.ETSY_API_KEY;
    const sharedSecret = process.env.ETSY_SHARED_SECRET || "";
    const xApiKey = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
    const headers = { "x-api-key": xApiKey, "Authorization": `Bearer ${shop.access_token}` };

    console.log(`Syncing shop ${shop.etsy_shop_id} (${shop.shop_name})...`);

    // 1. Fetch user details from Etsy
    let realEmail = null;
    let realName = null;
    try {
      const userRes = await fetch(`https://openapi.etsy.com/v3/application/users/${shop.etsy_user_id}`, { headers });
      if (userRes.ok) {
        const uData = await userRes.json();
        const fullName = [uData.first_name, uData.last_name].filter(Boolean).join(" ");
        realName = fullName || uData.first_name || uData.login_name || shop.shop_name;
        realEmail = uData.primary_email || uData.email || null;
      }
    } catch (e) {
      console.error("User fetch error:", e.message);
    }

    if (realName || realEmail) {
      await pool.query(
        `UPDATE "podsypro_v03serkan"."users" SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3`,
        [realName, realEmail, shop.user_id]
      );
      console.log(`Updated user ${shop.user_id}: Name="${realName}", Email="${realEmail}"`);
    }

    // 2. Fetch Shop Details from Etsy
    const detailRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsy_shop_id}`, { headers });
    if (detailRes.ok) {
      const sData = await detailRes.json();
      const totalSales = sData.transaction_sold_count || 0;
      const reviewCount = sData.review_count || 0;
      const reviewAverage = sData.review_average || 0;
      const activeListings = sData.listing_active_count || 0;
      const createDate = sData.create_date ? new Date(sData.create_date * 1000) : new Date();

      await pool.query(
        `UPDATE "podsypro_v03serkan"."shops" SET 
          shop_name = $1,
          is_own_shop = TRUE,
          transaction_sold_count = $2,
          review_count = $3,
          review_average = $4,
          listing_active_count = $5,
          create_date = $6,
          last_synced_at = NOW()
         WHERE id = $7`,
        [sData.shop_name || shop.shop_name, totalSales, reviewCount, reviewAverage, activeListings, createDate, shop.id]
      );
      console.log(`Updated shop ${shop.etsy_shop_id}: Sales=${totalSales}, Reviews=${reviewCount}, ActiveListings=${activeListings}`);
    } else {
      console.error("Shop details fetch failed:", await detailRes.text());
    }

    // 3. Fetch Active Listings
    const listingsRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsy_shop_id}/listings/active?limit=100`, { headers });
    if (listingsRes.ok) {
      const lData = await listingsRes.json();
      const results = lData.results || [];
      console.log(`Fetched ${results.length} active listings from Etsy.`);
      for (const item of results) {
        const price = item.price ? item.price.amount / item.price.divisor : 0;
        const currency = item.price ? item.price.currency_code : 'USD';
        await pool.query(
          `INSERT INTO "podsypro_v03serkan"."listings" 
            (id, etsy_listing_id, shop_id, title, state, price_amount, price_currency, last_synced_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (etsy_listing_id) 
           DO UPDATE SET title = EXCLUDED.title, state = EXCLUDED.state, price_amount = EXCLUDED.price_amount, price_currency = EXCLUDED.price_currency, last_synced_at = NOW()`,
          [item.listing_id.toString(), shop.id, item.title, item.state, price, currency]
        );
      }
      console.log("Listings synced to database.");
    } else {
      console.error("Listings fetch failed:", await listingsRes.text());
    }

  } catch (e) {
    console.error("syncExisting Error:", e);
  } finally {
    await pool.end();
  }
}

syncExisting();

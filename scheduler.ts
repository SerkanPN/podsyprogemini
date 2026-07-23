import {
  prisma,
  etsyFetch,
  saveEtsyListingToDb,
  createListingSnapshot,
  saveEtsyShopToDb,
  isListingEligibleForAutoSync,
  isShopEligibleForAutoSync
} from "./db";

console.log("Scheduler initialization...");

export async function runSyncJob() {
  console.log("[SCHEDULER] Starting automated sync job...");
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // 1. Keyword Sync
  try {
    const expiredKeywords = await prisma.keywordQuery.findMany({
      where: {
        lastQueriedAt: {
          lt: twentyFourHoursAgo
        }
      }
    });

    console.log(`[SCHEDULER] Found ${expiredKeywords.length} expired keyword searches to sync.`);
    for (const kw of expiredKeywords) {
      try {
        console.log(`[SCHEDULER] Auto-refreshing keyword: "${kw.keyword}"`);
        const data = await etsyFetch(`https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(kw.keyword)}&limit=100`);
        const results = data.results || [];
        
        // As requested: only add new listings
        for (const item of results) {
          const etsyId = item.listing_id.toString();
          const existing = await prisma.listing.findUnique({ where: { etsyId } });
          if (!existing) {
            await saveEtsyListingToDb(item);
          }
        }

        // Update keyword search sync time and list of listing IDs
        await prisma.keywordQuery.update({
          where: { id: kw.id },
          data: {
            lastQueriedAt: new Date(),
            listingIds: results.map((r: any) => r.listing_id).join(',')
          }
        });
      } catch (err) {
        console.error(`[SCHEDULER] Failed to sync keyword "${kw.keyword}":`, err);
      }
    }
  } catch (err) {
    console.error("[SCHEDULER] Error processing keyword sync:", err);
  }

  // 2. Listing ID Daily Sync
  try {
    const expiredListings = await prisma.listing.findMany({
      where: {
        lastQueriedAt: {
          lt: twentyFourHoursAgo
        }
      }
    });

    console.log(`[SCHEDULER] Found ${expiredListings.length} expired listings to evaluate for auto-sync.`);
    for (const listing of expiredListings) {
      try {
        const isEligible = isListingEligibleForAutoSync(listing);
        if (isEligible) {
          console.log(`[SCHEDULER] Listing ${listing.etsyId} ("${listing.title.substring(0, 20)}...") is eligible. Auto-syncing...`);
          const data = await etsyFetch(`https://openapi.etsy.com/v3/application/listings/${listing.etsyId}?includes=Images,Shop`);
          
          const dbListing = await saveEtsyListingToDb(data, true);
          if (dbListing) {
            await createListingSnapshot(
              dbListing.id,
              dbListing.views,
              dbListing.favorites,
              dbListing.price || 0
            );
          }
        } else {
          console.log(`[SCHEDULER] Listing ${listing.etsyId} is NOT eligible for auto-sync (views/age or update criteria not met).`);
        }
      } catch (err) {
        console.error(`[SCHEDULER] Failed to sync listing ${listing.etsyId}:`, err);
      }
    }
  } catch (err) {
    console.error("[SCHEDULER] Error processing listing sync:", err);
  }

  // 3. Shop Daily Sync & Shop Listings Sync
  try {
    const expiredShops = await prisma.shop.findMany({
      where: {
        lastQueriedAt: {
          lt: twentyFourHoursAgo
        }
      }
    });

    console.log(`[SCHEDULER] Found ${expiredShops.length} expired shops to evaluate for auto-sync.`);
    for (const shop of expiredShops) {
      try {
        const isEligible = await isShopEligibleForAutoSync(shop.id);
        if (isEligible) {
          console.log(`[SCHEDULER] Shop ${shop.shopName} (ID: ${shop.etsyShopId}) is eligible for auto-sync. Syncing...`);
          
          // Sync Shop Details
          const shopData = await etsyFetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsyShopId}`);
          const dbShop = await saveEtsyShopToDb(shopData, true);

          // Fetch Shop Listings
          const listingsData = await etsyFetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsyShopId}/listings/active?limit=100&includes=Images`);
          const results = listingsData.results || [];

          for (const item of results) {
            // Save the listing first
            const dbListing = await saveEtsyListingToDb(item, false);
            if (dbListing) {
              // Subject to the same listing ID conditions (monthly views > 100 and update date < 1 week)
              const isListingEligible = isListingEligibleForAutoSync(dbListing);
              if (isListingEligible) {
                console.log(`[SCHEDULER] Auto-updating listing ${dbListing.etsyId} for shop ${shop.shopName}`);
                await createListingSnapshot(
                  dbListing.id,
                  dbListing.views,
                  dbListing.favorites,
                  dbListing.price || 0
                );
              }
            }
          }
        } else {
          console.log(`[SCHEDULER] Shop ${shop.shopName} (ID: ${shop.etsyShopId}) is NOT eligible for auto-sync (sales increase < 10 in last 3 snapshot queries).`);
        }
      } catch (err) {
        console.error(`[SCHEDULER] Failed to sync shop ${shop.etsyShopId}:`, err);
      }
    }
  } catch (err) {
    console.error("[SCHEDULER] Error processing shop sync:", err);
  }

  console.log("[SCHEDULER] Automated sync job finished.");
}

export function startScheduler() {
  console.log("[SCHEDULER] Starting background scheduler (runs check every hour)...");
  
  // Run immediately on boot
  setTimeout(() => {
    runSyncJob().catch(err => console.error("[SCHEDULER] Job error on boot:", err));
  }, 5000);

  // Check every hour
  setInterval(() => {
    runSyncJob().catch(err => console.error("[SCHEDULER] Job error:", err));
  }, 60 * 60 * 1000);
}

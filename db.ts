import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export let defaultUserId = "";

export async function ensureDefaultUser() {
  const defaultUser = await prisma.user.upsert({
    where: { email: "default@podsy.pro" },
    update: {},
    create: {
      email: "default@podsy.pro",
      name: "Default User"
    }
  });
  defaultUserId = defaultUser.id;
  return defaultUserId;
}

// Global Etsy Fetch helper
export async function etsyFetch(url: string) {
  const apiKey = process.env.ETSY_API_KEY;
  const sharedSecret = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET;
  if (!apiKey) {
    throw new Error("ETSY_API_KEY is not configured");
  }

  const headerValue = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;

  const headers: Record<string, string> = { 
    "x-api-key": headerValue,
    "Accept": "application/json"
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Etsy API returned ${response.status}: ${text}`);
  }
  return response.json();
}

export async function enrichListings(listings: any[]) {
  if (!listings || listings.length === 0) return [];
  const results = [];
  
  // Etsy allows max 100 listing_ids per request
  for (let i = 0; i < listings.length; i += 100) {
    const chunk = listings.slice(i, i + 100);
    const ids = chunk.map(l => l.listing_id).join(',');
    try {
      const batchData = await etsyFetch(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${ids}&includes=Images,Shop`);
      if (batchData.results) {
        results.push(...batchData.results);
      }
    } catch (error) {
      console.error("Batch enrichment failed for a chunk", error);
      // fallback to original chunks for failed ones
      results.push(...chunk);
    }
  }
  return results;
}

export async function saveEtsyListingToDb(item: any, hasFullDetails = false, lastQueriedAt = new Date(), extraData: any = {}) {
  const shopId = item.shop_id?.toString() || item.shop?.shop_id?.toString();
  if (!shopId) return null;

  // 1. Ensure Shop exists
  let dbShop = await prisma.shop.findUnique({ where: { etsyShopId: shopId } });
  if (!dbShop) {
    dbShop = await prisma.shop.create({
      data: {
        etsyShopId: shopId,
        shopName: item.shop?.shop_name || `Shop #${shopId}`,
        userId: defaultUserId,
        lastQueriedAt
      }
    });
  }

  // 2. Upsert Listing
  const etsyId = item.listing_id.toString();
  const price = item.price ? (item.price.amount / item.price.divisor) : 0;
  const originalUpdate = item.updated_tsz ? new Date(item.updated_tsz * 1000) : new Date();
  
  const imagesJson = JSON.stringify(item.images || []);
  const videosJson = JSON.stringify(item.videos || extraData.videos || []);
  const tagsJson = JSON.stringify(item.tags || []);
  const inventoryJson = JSON.stringify(extraData.inventory || {});
  const propertiesJson = JSON.stringify(extraData.properties || []);
  const reviewsJson = JSON.stringify(extraData.reviews || []);
  const shippingPrice = extraData.shippingPrice || null;
  const url = item.url || "";
  const rawJson = JSON.stringify(item);

  const dbListing = await prisma.listing.upsert({
    where: { etsyId },
    update: {
      title: item.title,
      description: item.description || "",
      price,
      views: item.views || 0,
      favorites: item.num_favorers || 0,
      imagesJson,
      videosJson,
      tagsJson,
      inventoryJson,
      propertiesJson,
      reviewsJson,
      shippingPrice,
      url,
      hasFullDetails,
      rawJson,
      lastQueriedAt,
      updatedAt: originalUpdate
    },
    create: {
      etsyId,
      shopId: dbShop.id,
      title: item.title,
      description: item.description || "",
      price,
      views: item.views || 0,
      favorites: item.num_favorers || 0,
      imagesJson,
      videosJson,
      tagsJson,
      inventoryJson,
      propertiesJson,
      reviewsJson,
      shippingPrice,
      url,
      hasFullDetails,
      rawJson,
      lastQueriedAt,
      updatedAt: originalUpdate
    }
  });

  return dbListing;
}

export async function createListingSnapshot(listingIdInDb: string, views: number, favorites: number, price: number) {
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  prisma.listingSnapshot.findFirst({
    where: {
      listingId: listingIdInDb,
      createdAt: { gte: todayStart, lte: todayEnd }
    }
  }).then(existingSnapshot => {
    if (!existingSnapshot) {
      return prisma.listingSnapshot.create({
        data: {
          listingId: listingIdInDb,
          views,
          favorites,
          price
        }
      });
    }
  }).catch(err => console.error("Error creating listing snapshot", err));
}

export async function saveEtsyShopToDb(shopDetails: any, hasFullDetails = false, lastQueriedAt = new Date()) {
  const shopId = shopDetails.shop_id.toString();
  const totalSales = shopDetails.transaction_sold_count || shopDetails.transaction_s_count || shopDetails.transaction_count || 0;
  const rawJson = JSON.stringify(shopDetails);

  let dbShop = await prisma.shop.findUnique({ where: { etsyShopId: shopId } });
  if (!dbShop) {
    dbShop = await prisma.shop.create({
      data: {
        etsyShopId: shopId,
        shopName: shopDetails.shop_name,
        userId: defaultUserId,
        totalSales,
        hasFullDetails,
        rawJson,
        lastQueriedAt
      }
    });
  } else {
    dbShop = await prisma.shop.update({
      where: { etsyShopId: shopId },
      data: {
        shopName: shopDetails.shop_name,
        totalSales,
        hasFullDetails,
        rawJson,
        lastQueriedAt
      }
    });
  }

  // Create snapshot without blocking
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  prisma.shopSnapshot.findFirst({
    where: {
      shopId: dbShop.id,
      createdAt: { gte: todayStart, lte: todayEnd }
    }
  }).then(existingSnapshot => {
    if (!existingSnapshot) {
      return prisma.shopSnapshot.create({
        data: {
          shopId: dbShop.id,
          totalSales
        }
      });
    }
  }).catch(err => console.error("Error saving shop snapshot", err));

  return dbShop;
}

export function formatDbListing(dbListing: any) {
  try {
    if (dbListing.rawJson && dbListing.rawJson !== "{}") {
      const parsed = JSON.parse(dbListing.rawJson);
      parsed.views = dbListing.views;
      parsed.num_favorers = dbListing.favorites;
      if (dbListing.price !== null && dbListing.price !== undefined) {
        parsed.price = {
          amount: Math.round(dbListing.price * 100),
          divisor: 100,
          currency_code: parsed.price?.currency_code || "USD"
        };
      }
      if (dbListing.shop) {
        parsed.shop = {
          shop_id: parseInt(dbListing.shop.etsyShopId),
          shop_name: dbListing.shop.shopName,
          transaction_count: dbListing.shop.totalSales,
          ...parsed.shop
        };
      }
      
      // Inject new fields from DB
      parsed.videos = JSON.parse(dbListing.videosJson || "[]");
      parsed.inventory = JSON.parse(dbListing.inventoryJson || "{}");
      parsed.properties = JSON.parse(dbListing.propertiesJson || "[]");
      parsed.reviews = JSON.parse(dbListing.reviewsJson || "[]");
      parsed.shippingPrice = dbListing.shippingPrice;

      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse rawJson for listing, falling back...", e);
  }

  return {
    listing_id: parseInt(dbListing.etsyId),
    title: dbListing.title,
    description: dbListing.description,
    price: {
      amount: Math.round(dbListing.price * 100),
      divisor: 100,
      currency_code: "USD"
    },
    views: dbListing.views,
    num_favorers: dbListing.favorites,
    url: dbListing.url,
    images: JSON.parse(dbListing.imagesJson || "[]"),
    videos: JSON.parse(dbListing.videosJson || "[]"),
    inventory: JSON.parse(dbListing.inventoryJson || "{}"),
    properties: JSON.parse(dbListing.propertiesJson || "[]"),
    reviews: JSON.parse(dbListing.reviewsJson || "[]"),
    shippingPrice: dbListing.shippingPrice,
    shop: {
      shop_name: dbListing.shop?.shopName
    },
    shop_id: dbListing.shop ? parseInt(dbListing.shop.etsyShopId) : parseInt(dbListing.shopId),
    original_creation_timestamp: Math.round(dbListing.createdAt.getTime() / 1000),
    updated_tsz: Math.round(dbListing.updatedAt.getTime() / 1000)
  };
}

export function isListingEligibleForAutoSync(dbListing: any) {
  const now = new Date();
  const createdAt = dbListing.createdAt || new Date();
  const ageInMonths = Math.max(1, (now.getTime() - createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000));
  const averageMonthlyViews = dbListing.views / ageInMonths;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const isUpdatedRecently = dbListing.updatedAt >= oneWeekAgo;

  return averageMonthlyViews > 100 && isUpdatedRecently;
}

export async function isShopEligibleForAutoSync(shopId: string) {
  const snapshots = await prisma.shopSnapshot.findMany({
    where: { shopId },
    orderBy: { createdAt: "desc" },
    take: 3
  });
  if (snapshots.length < 3) {
    return true;
  }
  const increase = snapshots[0].totalSales - snapshots[2].totalSales;
  return increase >= 10;
}

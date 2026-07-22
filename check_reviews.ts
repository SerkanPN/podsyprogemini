import { etsyFetch } from "./db.js";

async function checkReviews() {
  const id = '1451559869'; // Guessing the ID is not available in the screenshot, I'll search for the wallpaper. Wait, I can just use any ID from my DB that has reviews.
  // I will just query the last fetched listing from the DB.
  import { prisma } from './db.js';
  const listing = await prisma.listing.findFirst({ orderBy: { createdAt: 'desc' } });
  if (listing) {
    console.log("Listing ID:", listing.etsyId);
    const data = await etsyFetch(`https://openapi.etsy.com/v3/application/listings/${listing.etsyId}/reviews`);
    console.log("Count from API:", data.count);
    if (data.results && data.results.length > 0) {
      console.log("Sample review raw data:", data.results[0]);
    }
  } else {
    console.log("No listings in DB.");
  }
}
checkReviews().catch(console.error).finally(() => process.exit(0));

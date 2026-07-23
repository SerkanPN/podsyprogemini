import { prisma } from './db.js';
async function clearDB() {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Listing", "Shop", "ListingSnapshot", "ShopSnapshot", "TrackedItem" CASCADE;');
  console.log('Database listings and shops cleared using CASCADE.');
}
clearDB().catch(console.error).finally(() => process.exit(0));

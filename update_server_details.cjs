const fs = require('fs');

let c = fs.readFileSync('server.ts', 'utf8');

const targetFunctionStart = c.indexOf('apiRouter.get("/etsy/listing/:id", async (req, res) => {');
const targetFunctionEnd = c.indexOf('apiRouter.get("/etsy/listing/:id/reviews", async (req, res) => {');

if (targetFunctionStart > -1 && targetFunctionEnd > -1) {
  const newFunction = `apiRouter.get("/etsy/listing/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const existing = await prisma.listing.findUnique({
        where: { etsyId: id },
        include: { shop: true }
      });

      if (existing && existing.hasFullDetails && existing.lastQueriedAt > twentyFourHoursAgo) {
        console.log(\`Serving listing \${id} from database cache\`);
        return res.json(formatDbListing(existing));
      }

      console.log(\`Fetching listing \${id} from Etsy API\`);
      const data = await etsyFetch(\`https://openapi.etsy.com/v3/application/listings/\${id}?includes=Images,Shop,Videos\`);
      
      if (data.taxonomy_id) {
        try {
          const TAXONOMY_FILE = require("path").join(process.cwd(), "taxonomy_cache.json");
          if (require("fs").existsSync(TAXONOMY_FILE)) {
             const taxonomyData = JSON.parse(require("fs").readFileSync(TAXONOMY_FILE, "utf-8"));
             const findTaxonomy = (nodes, targetId) => {
               for (const node of nodes) {
                 if (node.id === targetId) return node.name;
                 if (node.children && node.children.length > 0) {
                   const found = findTaxonomy(node.children, targetId);
                   if (found) return \`\${node.name} > \${found}\`;
                 }
               }
               return null;
             };
             const categoryName = findTaxonomy(taxonomyData, data.taxonomy_id);
             data.taxonomy_name = categoryName || \`Category #\${data.taxonomy_id}\`;
          }
        } catch (e) {
          console.error("Failed to resolve taxonomy name:", e);
        }
      }

      const extraData = {};
      try {
        const shopIdToUse = data.shop?.shop_id || data.shop_id;
        const parallelFetches = [
          etsyFetch(\`https://openapi.etsy.com/v3/application/listings/\${id}/properties\`).catch(() => null),
          etsyFetch(\`https://openapi.etsy.com/v3/application/listings/\${id}/inventory\`).catch(() => null),
          etsyFetch(\`https://openapi.etsy.com/v3/application/listings/\${id}/reviews\`).catch(() => null),
          data.shipping_profile_id && shopIdToUse 
            ? etsyFetch(\`https://openapi.etsy.com/v3/application/shops/\${shopIdToUse}/shipping-profiles\`).catch(() => null)
            : Promise.resolve(null)
        ];
        
        const [propsRes, invRes, revRes, shipRes] = await Promise.all(parallelFetches);
        if (propsRes) extraData.properties = propsRes.results || [];
        if (invRes) extraData.inventory = invRes;
        if (revRes) extraData.reviews = revRes.results || [];
        
        if (shipRes && shipRes.results) {
           const profile = shipRes.results.find(p => p.shipping_profile_id === data.shipping_profile_id);
           if (profile && profile.shipping_profile_destinations) {
             const dest = profile.shipping_profile_destinations.find(d => d.primary_cost);
             if (dest && dest.primary_cost) {
               extraData.shippingPrice = dest.primary_cost.amount / dest.primary_cost.divisor;
             }
           }
        }
      } catch (err) {
        console.error("Failed fetching extra data:", err);
      }

      const dbListing = await saveEtsyListingToDb(data, true, new Date(), extraData);
      if (dbListing) {
        createListingSnapshot(
          dbListing.id,
          data.views || 0,
          data.num_favorers || 0,
          dbListing.price || 0
        ).catch(console.error);
      }

      return res.json(formatDbListing(dbListing));
    } catch (error) {
      console.error("Etsy listing error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  `;
  c = c.substring(0, targetFunctionStart) + newFunction + c.substring(targetFunctionEnd);
  fs.writeFileSync('server.ts', c);
  console.log("Updated listing endpoint.");
} else {
  console.error("Could not find the function boundaries.");
}

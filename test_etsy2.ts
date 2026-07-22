import { etsyFetch } from "./db.js";

async function test() {
  const listingId = '1587946017';
  
  // 1. Taxonomy
  try {
    const taxData = await etsyFetch(`https://openapi.etsy.com/v3/application/seller-taxonomy/nodes`);
    console.log('Taxonomy results count:', taxData.results?.length);
    const findTaxonomy = (nodes, targetId) => {
      for (const node of nodes) {
        if (node.id === targetId) return node.name;
        if (node.children && node.children.length > 0) {
          const found = findTaxonomy(node.children, targetId);
          if (found) return `${node.name} > ${found}`;
        }
      }
      return null;
    };
    console.log('Category 125 name:', findTaxonomy(taxData.results || [], 125));
  } catch(e) {
    console.error('Taxonomy Error:', e);
  }

  // 2. Reviews
  try {
    const reviewsData = await etsyFetch(`https://openapi.etsy.com/v3/application/listings/${listingId}/reviews`);
    console.log('Reviews count:', reviewsData.count);
    if (reviewsData.results?.length > 0) {
      console.log('First review:', reviewsData.results[0]);
    }
  } catch(e) {
    console.error('Reviews Error:', e);
  }

  // 3. Listing (for Bestseller)
  try {
    const listData = await etsyFetch(`https://openapi.etsy.com/v3/application/listings/${listingId}`);
    console.log('Is Best Seller:', listData.is_bestseller);
    console.log('Taxonomy ID:', listData.taxonomy_id);
    console.log('Tags:', listData.tags);
  } catch (e) {
    console.error('Listing Error:', e);
  }
}

test();

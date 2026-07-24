import dotenv from 'dotenv';
dotenv.config();

const ETSY_API_KEY = process.env.ETSY_API_KEY;

async function testEtsy() {
  const headers = { 'x-api-key': ETSY_API_KEY };
  
  try {
    const taxRes = await fetch('https://openapi.etsy.com/v3/application/buyer-taxonomy/nodes', { headers });
    const taxData = await taxRes.json();
    console.log('Taxonomy results count:', taxData.results?.length);
  } catch (e) {
    console.error('Taxonomy fetch failed', e);
  }

  const listingId = '1587946017';
  try {
    const listRes = await fetch(`https://openapi.etsy.com/v3/application/listings/${listingId}?includes=Images,Shop,Videos`, { headers });
    const listData = await listRes.json();
    console.log('\nTaxonomy ID:', listData.taxonomy_id);
    console.log('Is Best Seller:', listData.is_bestseller); // check if exists
  } catch(e) {}

  try {
    const reviewsRes = await fetch(`https://openapi.etsy.com/v3/application/listings/${listingId}/reviews`, { headers });
    const reviewsData = await reviewsRes.json();
    if (reviewsData.results) {
      console.log('Number of reviews:', reviewsData.results.length);
      console.log('Count from JSON:', reviewsData.count);
    } else {
        console.log('Reviews data error:', reviewsData);
    }
  } catch(e) {}
}

testEtsy();

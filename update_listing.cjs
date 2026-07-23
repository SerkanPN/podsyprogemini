const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'ListingDetail.tsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Remove separate reviews fetching logic
c = c.replace(/const fetchReviews = async \(\) => \{[\s\S]*?\};\n\n    if \(id\) \{\n      fetchDetail\(\);\n      fetchReviews\(\);\n    \}/, `if (id) { fetchDetail(); }`);

c = c.replace(/const \[reviews, setReviews\] = useState<any\[\]>\(\[\]\);\n  const \[reviewsCount, setReviewsCount\] = useState<number>\(0\);\n  const \[reviewsLoading, setReviewsLoading\] = useState\(false\);/, '');

// 2. Use data.reviews directly
c = c.replace(/Customer Reviews \(\{reviewsCount\}\)/, 'Customer Reviews ({data.reviews?.length || 0})');
c = c.replace(/reviews\.reduce/g, '(data.reviews || []).reduce');
c = c.replace(/reviews\.length/g, '(data.reviews?.length || 0)');
c = c.replace(/reviewsLoading/g, 'false');
c = c.replace(/reviews\.map/g, '(data.reviews || []).map');

// 3. Update Shipping Price
c = c.replace(/\{data\.shipping_info\?\.primary_cost\?\.amount[\s\S]*?: data\.is_digital \? 'Digital \(No Shipping\)' : 'Free \/ Not specified'\}/, 
  `{data.shippingPrice !== undefined && data.shippingPrice !== null ? '$' + data.shippingPrice.toFixed(2) : data.is_digital ? 'Digital (No Shipping)' : 'Free / Not specified'}`);

// 4. Comment out AI optimizer block in UI (optional but good to keep UI clean since we disabled backend)
const aiStart = c.indexOf('{/* AI Optimizer Section */}');
if (aiStart > -1) {
  const aiEnd = c.indexOf('</div>\n        </div>\n\n        <div className="space-y-6">', aiStart);
  if (aiEnd > -1) {
     c = c.substring(0, aiStart) + `{/* AI Optimizer Hidden for now */}` + c.substring(aiEnd);
  }
}

// 5. Add Variations/Properties section before reviews
const reviewsSectionStart = c.indexOf('{/* Section 3: Customer Reviews */}');
if (reviewsSectionStart > -1) {
  const variationsBlock = `
          {/* Section: Properties & Variations */}
          {(data.properties?.length > 0 || data.inventory?.products?.length > 0) && (
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl shadow-sm p-6 space-y-6 mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
                <ListTodo className="w-5 h-5 text-indigo-400" />
                Variations & Properties
              </h2>
              
              {data.properties?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-2">Properties</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.properties.map((prop: any, i: number) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-md p-2 text-xs">
                        <span className="text-zinc-500">{prop.property_name}: </span>
                        <span className="text-zinc-200">{prop.values?.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.inventory?.products?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-2">Inventory Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                          <th className="py-2 pr-4 font-semibold">SKU / Variation</th>
                          <th className="py-2 pr-4 font-semibold">Price</th>
                          <th className="py-2 font-semibold">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {data.inventory.products.map((prod: any, i: number) => (
                          <tr key={i} className="text-zinc-300">
                            <td className="py-2 pr-4">
                              {prod.sku ? <span className="font-mono text-zinc-400 mr-2">[{prod.sku}]</span> : null}
                              {prod.property_values?.map((pv: any) => pv.values[0]).join(' / ') || 'Base Variant'}
                            </td>
                            <td className="py-2 pr-4">
                              {prod.offerings?.[0]?.price ? \`\${prod.offerings[0].price.currency_code} \${(prod.offerings[0].price.amount / prod.offerings[0].price.divisor).toFixed(2)}\` : '-'}
                            </td>
                            <td className="py-2">
                              {prod.offerings?.[0]?.quantity !== undefined ? prod.offerings[0].quantity : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          `;
  c = c.substring(0, reviewsSectionStart) + variationsBlock + c.substring(reviewsSectionStart);
}

fs.writeFileSync(file, c);
console.log('ListingDetail.tsx updated.');

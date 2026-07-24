const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'ListingDetail.tsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Remove AI states
c = c.replace(/const \[aiAnalysis[\s\S]*?const handleAiAnalysis[\s\S]*?\}\;\n/m, '');

// 2. Remove AI block and insert Videos, Variations, and Reviews
const aiSectionStart = c.indexOf('{/* AI Optimizer Section */}');
// find the end of the AI section (it's inside <div className="lg:col-span-2 space-y-6">)
// The next div after AI section is the end of lg:col-span-2
const afterAiSection = c.indexOf('</div>\n\n        <div className="space-y-6">');

if (aiSectionStart > -1 && afterAiSection > -1) {
  const newContent = `
          {/* Videos Section */}
          {data.videos && data.videos.length > 0 && (
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-white mb-4">Product Video</h2>
              <div className="aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-zinc-800">
                <video 
                  src={data.videos[0].video_url} 
                  poster={data.videos[0].thumbnail_url}
                  controls 
                  className="w-full h-full object-contain bg-black"
                />
              </div>
            </div>
          )}

          {/* Variations & Properties Section */}
          {(data.properties?.length > 0 || data.inventory?.products?.length > 0) && (
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-4 mb-4">
                Variations & Properties
              </h2>
              
              {data.properties?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Properties</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.properties.map((prop: any, i: number) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-md p-2 text-xs">
                        <span className="text-zinc-500 font-medium">{prop.property_name}: </span>
                        <span className="text-zinc-200">{prop.values?.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.inventory?.products?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Stock & Pricing</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500">
                          <th className="py-3 pr-4 font-semibold">SKU / Variation</th>
                          <th className="py-3 pr-4 font-semibold text-right">Price</th>
                          <th className="py-3 font-semibold text-right">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {data.inventory.products.map((prod: any, i: number) => (
                          <tr key={i} className="text-zinc-300 hover:bg-zinc-900/30 transition-colors">
                            <td className="py-3 pr-4">
                              {prod.sku && <span className="font-mono text-zinc-500 mr-2">[{prod.sku}]</span>}
                              {prod.property_values?.map((pv: any) => pv.values[0]).join(' / ') || 'Base Variant'}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono text-emerald-400">
                              {prod.offerings?.[0]?.price ? \`\${prod.offerings[0].price.currency_code} \${(prod.offerings[0].price.amount / prod.offerings[0].price.divisor).toFixed(2)}\` : '-'}
                            </td>
                            <td className="py-3 text-right">
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

          {/* Customer Reviews Section */}
          {data.reviews && data.reviews.length > 0 && (
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-4 mb-4">
                Customer Reviews ({data.reviews.length})
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {data.reviews.map((rev: any, i: number) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                          <span key={j}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {rev.created_timestamp ? new Date(rev.created_timestamp * 1000).toLocaleDateString() : ''}
                      </span>
                    </div>
                    {rev.review && <p className="text-sm text-zinc-300 italic">"{rev.review}"</p>}
                    <p className="text-xs text-zinc-500 mt-2 font-medium">- {rev.buyer_user_id || 'Etsy Buyer'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
`;
  c = c.substring(0, aiSectionStart) + newContent + c.substring(afterAiSection);
}

// 3. Make sure Shipping Price is shown in the right sidebar
// In the current file, where is shipping cost? It might be data.shipping_info... wait.
// Let's replace the whole right sidebar metadata block from <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg"> Stock 
// Wait, I will just rewrite the right sidebar metadata block safely using regex.
const rightSidebarRegex = /<div className="grid grid-cols-2 gap-4">([\s\S]*?)<\/div>\s*<\/div>\s*<a/;
if (c.match(rightSidebarRegex)) {
  const metaGrid = `
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Stock</p>
                <p className="text-sm text-zinc-200 font-mono">{data.quantity !== undefined ? data.quantity : 'N/A'}</p>
              </div>
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Status</p>
                <p className="text-sm text-zinc-200">{state === 'active' ? '✅ Active' : '❌ Inactive'}</p>
              </div>
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Shipping Cost</p>
                <p className="text-sm text-zinc-200 font-mono">
                  {data.shippingPrice !== undefined && data.shippingPrice !== null 
                    ? \`$\${data.shippingPrice.toFixed(2)}\` 
                    : (data.is_digital ? 'Digital (None)' : 'N/A')}
                </p>
              </div>
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Created On</p>
                <p className="text-xs text-zinc-200">
                  {data.original_creation_timestamp ? new Date(data.original_creation_timestamp * 1000).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <a`;
  c = c.replace(rightSidebarRegex, metaGrid);
}

fs.writeFileSync(file, c);
console.log('ListingDetail.tsx fixed successfully.');

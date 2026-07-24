const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'ListingDetail.tsx');
let c = fs.readFileSync(file, 'utf8');

c = c.replace(`              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                  {data.creation_timestamp ? new Date(data.creation_timestamp * 1000).toLocaleString() : 'N/A'}
                </p>
              </div>`, `              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Auto Renewal</p>
                <p className="text-sm text-zinc-200">{data.should_auto_renew ? '✅ Active' : '❌ Inactive'}</p>
              </div>
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Shipping Cost</p>
                <p className="text-sm text-zinc-200">
                  {data.shippingPrice !== undefined && data.shippingPrice !== null ? '$' + data.shippingPrice.toFixed(2) : (data.is_digital ? 'Digital (No Shipping)' : 'Free / Not specified')}
                </p>
              </div>
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Listed On</p>
                <p className="text-xs text-zinc-200">
                  {data.creation_timestamp ? new Date(data.creation_timestamp * 1000).toLocaleString() : 'N/A'}
                </p>
              </div>`);

fs.writeFileSync(file, c);
console.log('Fixed listing details divs');

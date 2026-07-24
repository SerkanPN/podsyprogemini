const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'ListingDetail.tsx');
let c = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Customer Reviews Section \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*\)\}/;

const textReviews = `const textReviews = data.reviews ? data.reviews.filter((r: any) => r.review && r.review.trim() !== '') : [];`;
// We can just embed this in the JSX, or define it before return. It's easier to embed it dynamically:

const newBlock = `{/* Customer Reviews Section */}
          {data.reviews && data.reviews.filter((r: any) => r.review && r.review.trim() !== '').length > 0 && (
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-4 mb-4">
                Customer Reviews ({data.reviews.filter((r: any) => r.review && r.review.trim() !== '').length})
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {data.reviews.filter((r: any) => r.review && r.review.trim() !== '').map((rev: any, i: number) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                          <span key={j}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {rev.create_timestamp ? new Date(rev.create_timestamp * 1000).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 italic">"{rev.review}"</p>
                    <p className="text-xs text-zinc-500 mt-2 font-medium">- {rev.buyer_user_id || 'Anonim Alıcı'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}`;

c = c.replace(regex, newBlock);

fs.writeFileSync(file, c);
console.log('Reviews updated in ListingDetail.tsx');

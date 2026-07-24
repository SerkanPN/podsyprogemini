const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'ShopDetail.tsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Remove AI state
c = c.replace(/const \[aiAnalysis[\s\S]*?const handleAiAnalysis[\s\S]*?\}\;\n/m, '');

// 2. Remove AI Optimizer JSX block (from {/* AI Shop Optimizer Section */} up to Recent Active Listings)
const aiSectionStart = c.indexOf('{/* AI Shop Optimizer Section */}');
const recentListingsStart = c.indexOf('<div>\n        <h2 className="text-xl font-bold tracking-tight text-white mb-4">Recent Active Listings</h2>');
if (aiSectionStart > -1 && recentListingsStart > -1) {
  // We'll replace the AI section with the Policies section
  const policiesBlock = `
      {/* Shop Policies */}
      {(shop.policy_welcome || shop.policy_payment || shop.policy_shipping || shop.policy_refunds) && (
        <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-zinc-800 pb-4">Shop Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shop.policy_welcome && (
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <h3 className="text-sm font-bold text-indigo-400 mb-2">Welcome</h3>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{shop.policy_welcome}</p>
              </div>
            )}
            {shop.policy_payment && (
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <h3 className="text-sm font-bold text-emerald-400 mb-2">Payment</h3>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{shop.policy_payment}</p>
              </div>
            )}
            {shop.policy_shipping && (
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <h3 className="text-sm font-bold text-blue-400 mb-2">Shipping</h3>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{shop.policy_shipping}</p>
              </div>
            )}
            {shop.policy_refunds && (
              <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
                <h3 className="text-sm font-bold text-rose-400 mb-2">Refunds & Returns</h3>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{shop.policy_refunds}</p>
              </div>
            )}
          </div>
        </div>
      )}

      `;
  c = c.substring(0, aiSectionStart) + policiesBlock + c.substring(recentListingsStart);
}

// 3. Fix total sales field
c = c.replace(/\{shop\.transaction_count \|\| 0\}/, '{shop.transaction_sold_count || shop.transaction_count || 0}');

fs.writeFileSync(file, c);
console.log('ShopDetail.tsx fixed successfully.');

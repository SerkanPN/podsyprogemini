const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'ShopDetail.tsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Comment out AI optimizer block in UI
const aiStart = c.indexOf('{/* AI Shop Optimizer Section */}');
if (aiStart > -1) {
  const aiEnd = c.indexOf('</div>\n    </div>\n  );\n}');
  if (aiEnd > -1) {
     c = c.substring(0, aiStart) + `{/* AI Optimizer Hidden for now */}` + c.substring(aiEnd);
  }
}

// 2. Add Policies section
const policiesBlock = `
        {/* Shop Policies */}
        {(shop.policy_welcome || shop.policy_payment || shop.policy_shipping || shop.policy_refunds) && (
          <div className="mt-8 pt-8 border-t border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4">Shop Policies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shop.policy_welcome && (
                <div className="bg-zinc-900/30 p-4 border border-zinc-800/85 rounded-lg">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">Welcome Message</p>
                  <p className="text-sm text-zinc-400 whitespace-pre-wrap">{shop.policy_welcome}</p>
                </div>
              )}
              {shop.policy_payment && (
                <div className="bg-zinc-900/30 p-4 border border-zinc-800/85 rounded-lg">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">Payment Policy</p>
                  <p className="text-sm text-zinc-400 whitespace-pre-wrap">{shop.policy_payment}</p>
                </div>
              )}
              {shop.policy_shipping && (
                <div className="bg-zinc-900/30 p-4 border border-zinc-800/85 rounded-lg">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">Shipping Policy</p>
                  <p className="text-sm text-zinc-400 whitespace-pre-wrap">{shop.policy_shipping}</p>
                </div>
              )}
              {shop.policy_refunds && (
                <div className="bg-zinc-900/30 p-4 border border-zinc-800/85 rounded-lg">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">Refund Policy</p>
                  <p className="text-sm text-zinc-400 whitespace-pre-wrap">{shop.policy_refunds}</p>
                </div>
              )}
            </div>
          </div>
        )}
`;

const insertPoint = c.indexOf('{/* AI Optimizer Hidden for now */}');
if (insertPoint > -1) {
    c = c.substring(0, insertPoint) + policiesBlock + c.substring(insertPoint);
}

fs.writeFileSync(file, c);
console.log('ShopDetail.tsx updated.');

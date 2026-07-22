import { useState } from 'react';

export default function ProfitCalculator({ price }: { price: number }) {
  const [cost, setCost] = useState(0);
  const [shipping, setShipping] = useState(0);

  // Etsy standard fees: $0.20 listing fee + 6.5% transaction + 3% + $0.25 payment processing
  const listingFee = 0.20;
  const transactionFee = price * 0.065;
  const paymentFee = (price + shipping) * 0.03 + 0.25;
  const totalFees = listingFee + transactionFee + paymentFee;
  
  const netProfit = price + shipping - cost - shipping - totalFees;
  const margin = price > 0 ? (netProfit / price) * 100 : 0;

  return (
    <div className="p-4 bg-zinc-950/40 border border-[#F1641E]/30 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
        <span className="text-xs font-bold text-[#F1641E] uppercase tracking-widest">Etsy Profit Calculator</span>
        <span className="text-xs text-zinc-400">Listing Price: ${price.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-zinc-500 uppercase block mb-1">Cost of Goods ($)</label>
          <input 
            type="number" 
            min="0"
            step="0.01"
            value={cost} 
            onChange={e => setCost(Number(e.target.value))}
            className="w-full bg-zinc-900 border border-zinc-700 text-sm text-zinc-200 px-3 py-1.5 rounded-md outline-none focus:border-[#F1641E] transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 uppercase block mb-1">Shipping Cost ($)</label>
          <input 
            type="number" 
            min="0"
            step="0.01"
            value={shipping} 
            onChange={e => setShipping(Number(e.target.value))}
            className="w-full bg-zinc-900 border border-zinc-700 text-sm text-zinc-200 px-3 py-1.5 rounded-md outline-none focus:border-[#F1641E] transition-colors"
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-lg p-3 space-y-2 text-xs">
        <div className="flex justify-between text-zinc-400">
          <span>Etsy Fees (Listing, Trans, Payment):</span>
          <span className="text-red-400">-${totalFees.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-zinc-800 pt-2 text-sm">
          <span className="text-zinc-200">Net Profit:</span>
          <span className={netProfit >= 0 ? "text-emerald-400" : "text-red-400"}>
            ${netProfit.toFixed(2)} ({margin.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

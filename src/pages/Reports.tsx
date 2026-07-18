import { useEffect, useState } from 'react';
import { PlayCircle, Loader2, Store, TrendingUp, Package } from 'lucide-react';
import { useFollowStore } from '../stores/useFollowStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Reports() {
  const { shops } = useFollowStore();
  const followedShops = Object.values(shops).sort((a, b) => b.addedAt - a.addedAt).slice(0, 5); // Max 5 for comparison
  
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompetitors = async () => {
      if (followedShops.length === 0) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('etsy_access_token');
        const headers: Record<string, string> = {};
        if (token && token !== 'null' && token !== 'undefined') {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const promises = followedShops.map(async (shop) => {
          const res = await fetch(`/api/etsy/shop/${shop.id}`, { headers });
          if (!res.ok) return null;
          const data = await res.json();
          if (data && data.shop) {
            return {
              name: data.shop.shop_name,
              sales: data.shop.transaction_sold_count || 0,
              listings: data.shop.listing_active_count || 0,
              rating: data.shop.review_average || 0
            };
          }
          return null;
        });
        
        const results = await Promise.all(promises);
        setCompetitors(results.filter(r => r !== null));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompetitors();
  }, [shops]); // simple dependency for demo

  return (
    <div className="space-y-6 flex flex-col h-full overflow-y-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">AI Reports & Competitors</h1>
        <p className="text-zinc-500 mt-1 text-sm">Competitor benchmarking and weekly performance insights.</p>
      </div>

      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
          <Store className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">Competitor Dashboard</h2>
        </div>
        <div className="p-6">
          {followedShops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-zinc-500">Follow some shops to see competitor analysis.</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
          ) : competitors.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[300px]">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 text-center">Total Sales Comparison</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={competitors} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickMargin={10} />
                    <YAxis stroke="#71717a" fontSize={11} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ color: '#818cf8' }}
                      cursor={{ fill: '#27272a', opacity: 0.4 }}
                    />
                    <Bar dataKey="sales" name="Total Sales" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Competitor Stats Overview</h3>
                <div className="grid grid-cols-1 gap-3">
                  {competitors.map((comp, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-zinc-200">{comp.name}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span>{comp.sales.toLocaleString()} sales</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                            <Package className="w-3 h-3 text-purple-400" />
                            <span>{comp.listings.toLocaleString()} listings</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-yellow-400">{comp.rating > 0 ? `${comp.rating.toFixed(1)} ★` : 'N/A'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center py-8">
              <p className="text-sm text-red-400">Failed to load competitor data.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">Weekly Audio Briefs</h2>
        <div className="flex items-center gap-4 p-4 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer bg-[#0d0d0d]">
          <PlayCircle className="w-10 h-10 text-indigo-500 shrink-0" />
          <div>
            <h3 className="text-white font-medium text-sm">Weekly Synthesis - July Week 2</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Generated by Gemini Live TTS</p>
          </div>
          <div className="ml-auto text-xs text-zinc-500 font-mono bg-zinc-800 px-2 py-1 rounded">
            03:45
          </div>
        </div>
      </div>
    </div>
  );
}

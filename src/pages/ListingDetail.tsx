import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Loader2, ArrowLeft, Heart, Eye, Package, ShieldCheck, TrendingUp, Hash, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useFollowStore } from '../stores/useFollowStore';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toggleListing, isListingFollowed } = useFollowStore();

  const [costOfGoods, setCostOfGoods] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<string>('');
  const [otherFees, setOtherFees] = useState<string>('');

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAiAnalysis = async () => {
    if (!data) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai-studio/analyze-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          tags: data.tags
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to analyze listing');
      setAiAnalysis(resData);
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('etsy_access_token');
        const headers: Record<string, string> = {};
        if (token && token !== 'null' && token !== 'undefined') {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`/api/etsy/listing/${id}`, { headers });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch listing');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  // Generate mock historical data based on current totals to show a growth pattern
  const trendData = useMemo(() => {
    if (!data) return [];
    const totalViews = data.views || 0;
    const totalFavs = data.num_favorers || 0;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Simulate a rising trend
    return days.map((day, index) => {
      // Create an artificial growth curve ending near the actual totals
      const factor = (index + 1) / days.length;
      // Add some randomness but generally keep it trending up
      const randomFactor = 0.8 + (Math.random() * 0.4); 
      
      return {
        name: day,
        views: Math.max(0, Math.floor(totalViews * factor * randomFactor)),
        favorites: Math.max(0, Math.floor(totalFavs * factor * randomFactor)),
      };
    });
  }, [data?.views, data?.num_favorers]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm text-zinc-500">Loading Listing Details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-lg max-w-lg text-center">
          <p className="font-semibold mb-1">Error Loading Listing</p>
          <p className="text-sm opacity-80">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm">
            &larr; Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    quantity,
    views,
    num_favorers,
    url,
    images,
    shop,
    tags
  } = data;

  const image = images?.[0]?.url_570xN || null;
  const priceFormatted = price ? `${price.currency_code} ${(price.amount / price.divisor).toFixed(2)}` : 'N/A';

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            {image ? (
              <img src={image} alt={title} className="w-full object-cover max-h-[600px] border-b border-zinc-800" />
            ) : (
              <div className="w-full h-[400px] bg-zinc-900 flex items-center justify-center text-zinc-600">
                No Image Available
              </div>
            )}
            <div className="p-6">
              <h1 className="text-2xl font-bold tracking-tight text-white mb-4">{title}</h1>
              
              <div className="prose prose-invert prose-zinc max-w-none text-sm text-zinc-400">
                <p className="whitespace-pre-wrap">{description}</p>
              </div>
            </div>
          </div>

          {/* AI Optimizer Section */}
          <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">AI Listing Optimizer</h2>
                  <p className="text-xs text-zinc-500">Analyze SEO, title, tags, and description</p>
                </div>
              </div>
              <button 
                onClick={handleAiAnalysis}
                disabled={aiLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Listing
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
                {aiError}
              </div>
            )}

            {aiAnalysis && !aiLoading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      SEO Score
                    </h3>
                    <div className="flex items-end gap-2">
                      <span className={`text-4xl font-bold font-mono ${
                        aiAnalysis.seoScore >= 80 ? 'text-emerald-400' : aiAnalysis.seoScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {aiAnalysis.seoScore}
                      </span>
                      <span className="text-zinc-500 text-sm mb-1">/ 100</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-zinc-300 mb-2">Description Critique</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{aiAnalysis.descriptionCritique}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Suggested Titles (High Click-Through Rate)
                  </h3>
                  <div className="space-y-2">
                    {aiAnalysis.titleSuggestions?.map((t: string, i: number) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-purple-400" />
                    Recommended Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.tagSuggestions?.map((tag: string, i: number) => (
                      <div key={i} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm text-zinc-500 mb-1">Price</p>
              <p className="text-3xl font-bold text-white tracking-tight">{priceFormatted}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="font-semibold">{views || 0}</span>
                </div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Views</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-rose-400 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="font-semibold">{num_favorers || 0}</span>
                </div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Favorites</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="font-semibold">{quantity || 0}</span>
                </div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">In Stock</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-semibold">Active</span>
                </div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Status</p>
              </div>
            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg text-sm font-bold transition-colors mb-3"
            >
              View on Etsy
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link 
              to={`/ai-studio?cloneId=${id}`} 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider shadow-md transition-colors mb-3"
            >
              <Sparkles className="w-4 h-4" /> AI Clone
            </Link>

            <button
              onClick={() => toggleListing({ id: id as string, title, image: image || undefined, shopName: shop?.shop_name })}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-sm font-bold transition-colors ${
                isListingFollowed(id as string)
                  ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600/30' 
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {isListingFollowed(id as string) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {isListingFollowed(id as string) ? 'Following Listing' : 'Follow Listing'}
            </button>
          </div>

          <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Growth Trends</h2>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFavs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#e4e4e7' }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                  <Area type="monotone" dataKey="views" name="Views" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="favorites" name="Favorites" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorFavs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {tags && tags.length > 0 && (
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">SEO Keywords</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <Link 
                    key={index} 
                    to={`/listings?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md text-xs font-medium hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {shop && (
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4">Sold By</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold border border-indigo-500/30">
                  {shop.shop_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Link to={`/shops/${shop.shop_id}`} className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                    {shop.shop_name}
                  </Link>
                  <p className="text-xs text-zinc-500 mt-0.5">Shop ID: {shop.shop_id}</p>
                </div>
              </div>
              <Link 
                to={`/shops/${shop.shop_id}`}
                className="w-full flex items-center justify-center px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold transition-colors border border-zinc-800"
              >
                View Shop Profile
              </Link>
            </div>
          )}

          <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-white tracking-tight mb-4">Profit Calculator</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Cost of Goods ($)</label>
                <input 
                  type="number"
                  value={costOfGoods}
                  onChange={(e) => setCostOfGoods(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Shipping Cost ($)</label>
                <input 
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Other Fees ($)</label>
                <input 
                  type="number"
                  value={otherFees}
                  onChange={(e) => setOtherFees(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              
              <div className="pt-3 mt-3 border-t border-zinc-800">
                {(() => {
                  const salePrice = price ? price.amount / price.divisor : 0;
                  const cogs = parseFloat(costOfGoods) || 0;
                  const ship = parseFloat(shippingCost) || 0;
                  const customFees = parseFloat(otherFees) || 0;
                  
                  // Etsy Fees
                  const listingFee = 0.20;
                  const transactionFee = salePrice * 0.065; // 6.5% of sale price (not including shipping here for simplicity, though Etsy includes shipping)
                  const paymentProcessingFee = (salePrice * 0.03) + 0.25; // roughly 3% + $0.25
                  
                  const totalEtsyFees = listingFee + transactionFee + paymentProcessingFee;
                  
                  const totalCost = cogs + ship + customFees + totalEtsyFees;
                  const profit = salePrice - totalCost;
                  const margin = salePrice > 0 ? (profit / salePrice) * 100 : 0;

                  return (
                    <>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-zinc-500">Sale Price</span>
                        <span className="text-sm text-zinc-200 font-mono">${salePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-zinc-500">Est. Etsy Fees</span>
                        <span className="text-xs text-red-400 font-mono">-${totalEtsyFees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-zinc-500">Total Costs</span>
                        <span className="text-sm text-red-400 font-mono">-${totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Est. Profit</p>
                          <p className={`text-lg font-bold font-mono mt-0.5 ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            ${profit.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Margin</p>
                          <p className={`text-lg font-bold font-mono mt-0.5 ${margin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {margin.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

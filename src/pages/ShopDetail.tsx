import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader2, Store, MapPin, Calendar, Star, TrendingUp, Flame, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { useFollowStore } from '../stores/useFollowStore';

const getApiUrl = (path: string) => {
  if (window.location.protocol.includes('chrome-extension')) {
    return `http://localhost:3000${path}`;
  }
  return path;
};

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toggleShop, isShopFollowed } = useFollowStore();

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAiAnalysis = async () => {
    if (!data?.shop) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch(getApiUrl('/api/ai-studio/analyze-shop'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName: data.shop.shop_name,
          title: data.shop.title,
          announcement: data.shop.announcement
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to analyze shop');
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
        const res = await fetch(getApiUrl(`/api/etsy/shop/${id}`), { headers });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch shop');
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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm text-zinc-500">Loading Shop Details...</p>
      </div>
    );
  }

  if (error || !data || !data.shop) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-lg max-w-lg text-center">
          <p className="font-semibold mb-1">Error Loading Shop</p>
          <p className="text-sm opacity-80">{error || 'Shop not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm">
            &larr; Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const { shop, listings } = data;

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </button>
      </div>

      <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl overflow-hidden shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/20 text-indigo-400 flex flex-col items-center justify-center shrink-0 shadow-lg">
            {shop.icon_url_fullxfull ? (
              <img src={shop.icon_url_fullxfull} alt={shop.shop_name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Store className="w-10 h-10 mb-1" />
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{shop.shop_name}</h1>
            <p className="text-lg text-zinc-400 mb-4 font-medium">{shop.title}</p>
            
            {shop.url && (
              <div className="flex items-center gap-3">
                <a
                  href={shop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-semibold transition-colors border border-zinc-700"
                >
                  Visit Shop on Etsy
                  <ExternalLink className="w-4 h-4 text-zinc-400" />
                </a>
                <button
                  onClick={() => toggleShop({ id: id as string, name: shop.shop_name, image: shop.icon_url_fullxfull || undefined })}
                  className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors ${
                    isShopFollowed(id as string)
                      ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600/30' 
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {isShopFollowed(id as string) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {isShopFollowed(id as string) ? 'Following Shop' : 'Follow Shop'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Shop Metrics Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 pt-8 border-t border-zinc-800">
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Active Listings</p>
            <p className="text-xl font-bold text-white">{shop.listing_active_count || 0}</p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Digital Items</p>
            <p className="text-xl font-bold text-white">{shop.digital_listing_count || 0}</p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Total Sales</p>
            <p className="text-xl font-bold text-white">{shop.transaction_sold_count || shop.transaction_count || 0}</p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Shop Followers</p>
            <p className="text-xl font-bold text-white">{shop.num_favorers || 0}</p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Feedback Rating</p>
            <p className="text-sm font-bold text-yellow-500 flex items-center gap-1">
              {shop.review_average ? shop.review_average.toFixed(1) : '0.0'} ★
              <span className="text-[10px] text-zinc-400 font-normal">({shop.review_count || 0} reviews)</span>
            </p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Shop Owner / Login</p>
            <p className="text-sm text-zinc-200 capitalize">{shop.login_name || 'N/A'}</p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Currency Code</p>
            <p className="text-sm text-zinc-200 uppercase font-mono">{shop.currency_code || 'USD'}</p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Vacation Mode</p>
            <p className={`text-sm font-semibold ${shop.is_vacation ? 'text-amber-400' : 'text-emerald-400'}`}>
              {shop.is_vacation ? 'Active' : 'Disabled'}
            </p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg col-span-1 md:col-span-2">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Custom Requests</p>
            <p className="text-sm text-zinc-200 font-semibold">
              {shop.accepts_custom_requests ? 'Accepts Custom Orders' : 'No Custom Orders'}
            </p>
          </div>
        </div>

        {/* Shop Announcement */}
        {shop.announcement && (
          <div className="mt-6 p-4 bg-zinc-900/30 border border-zinc-800/85 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">Shop Announcement</p>
            <p className="text-sm text-zinc-400 whitespace-pre-wrap italic leading-relaxed">
              "{shop.announcement}"
            </p>
          </div>
        )}
      </div>

      {/* AI Shop Optimizer Section */}
      <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">AI Shop Optimizer</h2>
              <p className="text-xs text-zinc-500">Get strategic advice on your shop's branding and announcement</p>
            </div>
          </div>
          <button 
            onClick={handleAiAnalysis}
            disabled={aiLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Shop
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 col-span-1 flex flex-col justify-center items-center text-center">
                <h3 className="text-sm font-bold text-zinc-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Overall Score
                </h3>
                <div className="flex items-end gap-2 justify-center">
                  <span className={`text-6xl font-bold font-mono ${
                    aiAnalysis.overallScore >= 80 ? 'text-emerald-400' : aiAnalysis.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {aiAnalysis.overallScore}
                  </span>
                  <span className="text-zinc-500 text-lg mb-2">/ 100</span>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-zinc-300 mb-2">Shop Title Feedback</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{aiAnalysis.shopTitleCritique}</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-zinc-300 mb-2">Announcement Strategy</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{aiAnalysis.announcementCritique}</p>
                </div>
              </div>
            </div>

            {aiAnalysis.brandingTips && aiAnalysis.brandingTips.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  Branding Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiAnalysis.brandingTips.map((tip: string, i: number) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300 flex gap-3">
                      <span className="text-blue-500 font-bold">{i + 1}.</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-4">Recent Active Listings</h2>
        
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((item: any) => {
              const image = item.images && item.images.length > 0 ? item.images[0].url_570xN : null;
              const isHot = item.views > 200 || item.num_favorers > 10;

              return (
                <Link 
                  key={item.listing_id} 
                  to={`/listings/${item.listing_id}`}
                  className="group bg-[#0d0d0d] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors shadow-sm flex flex-col"
                >
                  <div className="aspect-square bg-zinc-900 relative overflow-hidden">
                    {image ? (
                      <img src={image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold uppercase text-xs">No Image</div>
                    )}
                    {isHot && (
                      <div className="absolute top-2 right-2 bg-orange-500/90 text-white p-1.5 rounded-lg shadow-lg backdrop-blur-sm">
                        <Flame className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-zinc-200 font-medium tracking-tight line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </p>
                    <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                      <span className="text-zinc-300 font-mono text-sm font-semibold">
                        {item.price?.currency_code} {(item.price?.amount / item.price?.divisor).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {item.views || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-zinc-400">No active listings found for this shop.</p>
          </div>
        )}
      </div>
    </div>
  );
}

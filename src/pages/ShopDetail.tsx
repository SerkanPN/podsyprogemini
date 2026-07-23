import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader2, Store, MapPin, Calendar, Star, TrendingUp, Flame, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { useFollowStore } from '../stores/useFollowStore';

const getApiUrl = (path: string) => {
  if (window.location.protocol.includes('chrome-extension')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${baseUrl}${path}`;
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

  const [salesAnalysisLoading, setSalesAnalysisLoading] = useState(false);
  const [salesAnalysisResult, setSalesAnalysisResult] = useState<any[] | null>(null);
  const [salesAnalysisError, setSalesAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScrapedData = () => {
      setLoading(true);
      try {
        chrome.storage.local.get(['scrapedShopData'], (res) => {
          if (res.scrapedShopData && res.scrapedShopData.shopName === id) {
            setData(res.scrapedShopData);
          } else {
            setError('Please browse an Etsy shop page to load details.');
          }
          setLoading(false);
        });
      } catch (err: any) {
        setError('Extension context error.');
        setLoading(false);
      }
    };
    if (id) fetchScrapedData();
  }, [id]);

  const handleStartSalesAnalysis = () => {
    if (!data?.isSalesPublic || !data?.salesUrl) return;
    setSalesAnalysisLoading(true);
    setSalesAnalysisError(null);
    setSalesAnalysisResult(null);

    chrome.runtime.sendMessage(
      { type: 'START_SALES_ANALYSIS', salesUrl: data.salesUrl, shopName: data.shopName },
      (response) => {
        setSalesAnalysisLoading(false);
        if (response?.success) {
          setSalesAnalysisResult(response.results);
        } else {
          setSalesAnalysisError(response?.error || 'Analysis failed');
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm text-zinc-500">Loading Shop Details from page...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-lg max-w-lg text-center">
          <p className="font-semibold mb-1">Error Loading Shop</p>
          <p className="text-sm opacity-80">{error || 'Shop data not found in page'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm">
            &larr; Back
          </button>
        </div>
      </div>
    );
  }

  const shop = data;

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
            <Store className="w-10 h-10 mb-1" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{shop.shopName}</h1>
            <p className="text-lg text-zinc-400 mb-4 font-medium">{shop.shopTitle}</p>
            
            <div className="flex items-center gap-3">
              <a
                href={`https://www.etsy.com/shop/${shop.shopName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-semibold transition-colors border border-zinc-700"
              >
                Visit Shop on Etsy
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
              <button
                onClick={() => toggleShop({ id: id as string, name: shop.shopName })}
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
          </div>
        </div>

        {/* Shop Metrics Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-800">
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Total Sales</p>
            <p className="text-xl font-bold text-white">{shop.totalSales}</p>
          </div>
          <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Sales Visibility</p>
            <p className={`text-sm font-semibold ${shop.isSalesPublic ? 'text-emerald-400' : 'text-amber-400'}`}>
              {shop.isSalesPublic ? 'Public' : 'Private'}
            </p>
          </div>
        </div>
      </div>

      {/* Sales Analysis Section */}
      {shop.isSalesPublic && (
        <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Sales Analysis</h2>
                <p className="text-xs text-zinc-500">Scrape and analyze all sold items in the background</p>
              </div>
            </div>
            <button 
              onClick={handleStartSalesAnalysis}
              disabled={salesAnalysisLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              {salesAnalysisLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Satış Analizi Yap
                </>
              )}
            </button>
          </div>

          {salesAnalysisError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {salesAnalysisError}
            </div>
          )}

          {salesAnalysisResult && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-300">Sold Listings (Top 50)</h3>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {salesAnalysisResult.slice(0, 50).map((res, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-lg">
                    <span className="text-sm font-mono text-zinc-300">Listing ID: {res.listingId}</span>
                    <span className="text-sm font-bold text-emerald-400">{res.salesCount} Sales</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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

    </div>
  );
}

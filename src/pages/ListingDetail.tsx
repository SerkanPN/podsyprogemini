import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';
import ProfitCalculator from './ProfitCalculator';

const getApiUrl = (path: string) => {
  if (window.location.protocol.includes('chrome-extension')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${baseUrl}${path}`;
  }
  return path;
};

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isShopConnected, setIsShopConnected] = useState(false);

  const [copied, setCopied] = useState(false);

  // Fetch auth status and listing data
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check Auth Status
        try {
          const authRes = await fetch(getApiUrl('/api/etsy/auth-status'));
          if (authRes.ok) {
            const authData = await authRes.json();
            setIsShopConnected(authData.isConnected);
          }
        } catch (e) {
          console.error("Auth status error", e);
        }

        const token = localStorage.getItem('etsy_access_token');
        const headers: Record<string, string> = {};
        if (token && token !== 'null' && token !== 'undefined') {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(getApiUrl(`/api/etsy/listing/${id}`), { headers });
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

  const handleCopyTags = () => {
    if (data?.tags && data.tags.length > 0) {
      navigator.clipboard.writeText(data.tags.join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };



  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full bg-[#212121]">
        <div className="w-8 h-8 border-2 border-[#F1641E] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-zinc-400">Loading Listing Details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full bg-[#212121]">
        <div className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-6 py-4 rounded-xl max-w-lg text-center shadow-lg">
          <p className="font-bold text-red-500 mb-2">Error Loading Listing</p>
          <p className="text-xs text-zinc-400 mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white rounded-full transition-all">
            &larr; Back to Search Results
          </button>
        </div>
      </div>
    );
  }

  const {
    tags,
    num_favorers,
    views,
    original_creation_timestamp,
    creation_timestamp,
    last_modified_timestamp,
    updated_timestamp,
  } = data;

  // Strictly English date formatting
  const formatDateEn = (timestamp: number | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const createdTimestamp = original_creation_timestamp || creation_timestamp;
  const createdDateFormatted = formatDateEn(createdTimestamp);
  const modifiedDateFormatted = formatDateEn(last_modified_timestamp);
  const updatedDateFormatted = formatDateEn(updated_timestamp);

  // Calculate monthly estimates
  const estMonthlyViews = views !== undefined && createdTimestamp ? 
    Math.round((views / Math.max(1, (Date.now() / 1000 - createdTimestamp) / (60 * 60 * 24))) * 30) : null;
  const estMonthlyFavorites = num_favorers !== undefined && createdTimestamp ? 
    Math.round((num_favorers / Math.max(1, (Date.now() / 1000 - createdTimestamp) / (60 * 60 * 24))) * 30) : null;



  // Category breadcrumbs
  const categoryPath = ["Homepage", "Etsy Listing", id];

  return (
    <div className="min-h-screen bg-[#212121] text-[#F5F5F5] px-4 md:px-6 py-6 space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-semibold transition-colors self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to search results
        </button>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {categoryPath.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className={idx === categoryPath.length - 1 ? 'text-zinc-300 font-bold underline' : 'hover:text-white cursor-pointer'}>
                {item}
              </span>
              {idx < categoryPath.length - 1 && <span>&rsaquo;</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {!isShopConnected && (
          <div className="bg-zinc-900 border border-[#F1641E]/40 rounded-xl p-6 text-center shadow-lg space-y-4">
            <div className="w-12 h-12 bg-[#F1641E]/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-[#F1641E]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Mağazanız Bağlı Değil</h3>
              <p className="text-zinc-400 text-sm mt-1">
                Eklentinin tüm istatistiklerini, zaman çizelgesini, kâr hesaplayıcısını ve yapay zeka analizlerini kullanabilmek için Etsy mağazanızı bağlamanız gerekmektedir. Şimdilik sadece etiketleri görebilirsiniz.
              </p>
            </div>
            <button 
              onClick={() => {
                // Open auth flow in a new tab
                window.open(getApiUrl('/api/etsy/auth'), '_blank');
              }}
              className="inline-flex items-center justify-center bg-[#F1641E] hover:bg-[#d95a1a] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-full md:w-auto"
            >
              Etsy Mağazamı Bağla
            </button>
          </div>
        )}
        
        {/* Clickable Tags Block & Copy Button */}
        <div className={`p-4 bg-zinc-950/20 border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${!isShopConnected ? 'opacity-70 pointer-events-none' : ''}`}>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">SEO Tags ({tags?.length || 0})</span>
            <div className="flex flex-wrap gap-1.5">
              {tags && tags.length > 0 ? (
                tags.map((tag: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      const url = `https://www.etsy.com/search?q=${encodeURIComponent(tag)}`;
                      if (typeof chrome !== 'undefined' && chrome.tabs) {
                        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                          if (tabs[0] && tabs[0].id) {
                            chrome.tabs.update(tabs[0].id, { url });
                          } else {
                            window.open(url, '_blank');
                          }
                        });
                      } else {
                        window.open(url, '_blank');
                      }
                    }}
                    className="text-xs px-2.5 py-1 bg-zinc-900 border border-zinc-850 text-zinc-300 rounded-md hover:bg-zinc-800 hover:text-white hover:border-[#F1641E] transition-all cursor-pointer text-left"
                    title={`Search for "${tag}"`}
                  >
                    {tag}
                  </button>
                ))
              ) : (
                <span className="text-xs text-zinc-600">No tags specified for this listing</span>
              )}
            </div>
          </div>
          
          {tags && tags.length > 0 && isShopConnected && (
            <button 
              onClick={handleCopyTags}
              className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg transition-all flex items-center justify-center gap-2 text-xs font-semibold shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-[#F1641E]" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Tags'}
            </button>
          )}
        </div>

        {isShopConnected && (
          <>
            {/* Timeline Information (Strictly English Dates) */}
        <div className="p-4 bg-zinc-950/20 border border-zinc-800 rounded-xl space-y-3 text-xs">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block border-b border-zinc-800/50 pb-1.5">Timeline</span>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-0.5">
              <span className="text-zinc-500 block">First Created</span>
              <span className="font-semibold text-zinc-300">{createdDateFormatted}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-zinc-500 block">Modified</span>
              <span className="font-semibold text-zinc-300">{modifiedDateFormatted}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-zinc-500 block">Last Updated</span>
              <span className="font-semibold text-zinc-300">{updatedDateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Real Listing Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-950/20 border border-zinc-800 rounded-xl p-4 text-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1">Total Views</span>
            <span className="text-lg font-bold text-[#F5F5F5] font-mono">{views !== undefined ? views.toLocaleString() : 'N/A'}</span>
          </div>
          <div className="bg-zinc-950/20 border border-zinc-800 rounded-xl p-4 text-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1">Est. Monthly Views</span>
            <span className="text-lg font-bold text-[#F5F5F5] font-mono">{estMonthlyViews !== null ? estMonthlyViews.toLocaleString() : 'N/A'}</span>
          </div>
          <div className="bg-zinc-950/20 border border-zinc-800 rounded-xl p-4 text-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1">Total Favorites</span>
            <span className="text-lg font-bold text-[#F5F5F5] font-mono">{num_favorers !== undefined ? num_favorers.toLocaleString() : 'N/A'}</span>
          </div>
          <div className="bg-zinc-950/20 border border-zinc-800 rounded-xl p-4 text-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1">Est. Monthly Favorites</span>
            <span className="text-lg font-bold text-[#F5F5F5] font-mono">{estMonthlyFavorites !== null ? estMonthlyFavorites.toLocaleString() : 'N/A'}</span>
          </div>
        </div>

        {/* Profit Calculator */}
        {data.price && (
          <ProfitCalculator price={data.price.amount / data.price.divisor} />
        )}

        {/* AI CLONE Button (Solid Etsy Orange) */}
        <div className="pt-2">
          <Link 
            to={`/ai-studio?cloneId=${id}`}
            className="w-full py-3 bg-[#F1641E] hover:bg-[#d95316] text-[#F5F5F5] font-extrabold rounded-full transition-colors flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-md"
          >
            <Sparkles className="w-4 h-4 fill-current text-white" />
            AI CLONE
          </Link>
        </div>

        {/* AI Review Analyzer Mockup */}
        <div className="bg-zinc-950/20 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-[#F1641E]" />
              <h2 className="text-base font-bold text-[#F5F5F5]">AI Yorum Analizi</h2>
            </div>
            <button 
              className="px-4 py-2 bg-zinc-900 border border-[#F1641E]/40 text-zinc-300 hover:text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F1641E]" />
              Yorumları Analiz Et
            </button>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">
              "Alıcıların %80'i kargonun yavaşlığından şikayet etmiş. Herkes ürünün renginin fotoğraftakinden daha canlı olduğunu söylüyor."
            </p>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-zinc-950/20 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#F1641E]" />
              <h2 className="text-base font-bold text-[#F5F5F5]">AI SEO & Market Analysis</h2>
            </div>
            <button 
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed"
              disabled
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Report
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            AI functions are currently deactivated. When activated, they will analyze listing keywords, recommend SEO updates, estimate market saturation, and simulate pricing models.
          </p>
        </div>

          </>
        )}
      </div>
    </div>
  );
}

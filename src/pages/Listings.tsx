import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Loader2, Sparkles, TrendingUp, Flame, Search, Store, LayoutGrid, List, Filter, X, ArrowUp, ArrowDown, Bookmark, BookmarkCheck } from 'lucide-react';
import { useFollowStore } from '../stores/useFollowStore';

const calculateFirsatSkoru = (item: any) => {
  let score = 5;
  if (item.views > 500) score += 2;
  else if (item.views > 100) score += 1;
  
  if (item.num_favorers > 50) score += 2;
  else if (item.num_favorers > 10) score += 1;
  
  const price = item.price?.amount / (item.price?.divisor || 1) || 0;
  if (price > 0 && price < 10) score += 1;
  else if (price > 50) score -= 1;
  else if (price > 100) score -= 2;
  
  return Math.max(1, Math.min(10, score));
};

const getScoreColor = (score: number) => {
  if (score >= 8) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (score >= 5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
};

export default function Listings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || 't-shirt'; // Default query so it's never empty
  
  const { toggleKeyword, isKeywordFollowed, toggleListing, isListingFollowed } = useFollowStore();
  const keywordFollowed = isKeywordFollowed(query);

  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '');
  
  // Restore session state
  const sessionStateStr = sessionStorage.getItem('listingsState');
  const sessionState = sessionStateStr ? JSON.parse(sessionStateStr) : null;
  const isRestoring = sessionState && sessionState.query === query;

  const [loading, setLoading] = useState(!isRestoring);
  const [results, setResults] = useState<any[]>(isRestoring ? sessionState.results : []);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<string | null>(isRestoring ? sessionState.searchType : null);
  const [density, setDensity] = useState<'comfortable' | 'compact'>(isRestoring ? sessionState.density : 'comfortable');
  
  const [isFilterOpen, setIsFilterOpen] = useState(isRestoring ? sessionState.isFilterOpen : false);
  const [priceMin, setPriceMin] = useState(isRestoring ? sessionState.priceMin : '');
  const [priceMax, setPriceMax] = useState(isRestoring ? sessionState.priceMax : '');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | 'year'>(isRestoring ? sessionState.dateFilter : 'all');
  const [tagFilter, setTagFilter] = useState(isRestoring ? sessionState.tagFilter : '');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(isRestoring ? sessionState.sortConfig : { key: 'views', direction: 'desc' });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('etsy_access_token');
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Save session state when filters or results change
  useEffect(() => {
    sessionStorage.setItem('listingsState', JSON.stringify({
      query, density, isFilterOpen, priceMin, priceMax, dateFilter, tagFilter, sortConfig, results, searchType
    }));
  }, [query, density, isFilterOpen, priceMin, priceMax, dateFilter, tagFilter, sortConfig, results, searchType]);

  // Restore scroll position
  useEffect(() => {
    if (isRestoring && sessionState.scrollPos) {
      setTimeout(() => {
        const container = document.getElementById('listings-scroll-container');
        if (container) container.scrollTop = sessionState.scrollPos;
        else window.scrollTo(0, sessionState.scrollPos);
      }, 100);
    }
  }, [isRestoring]);

  const handleScroll = (e: any) => {
    const scrollPos = e.target.scrollTop || window.scrollY;
    const state = JSON.parse(sessionStorage.getItem('listingsState') || '{}');
    sessionStorage.setItem('listingsState', JSON.stringify({ ...state, scrollPos }));
  };

  useEffect(() => {
    const fetchListings = async () => {
      // If we already restored results for this exact query, don't fetch again unless results are empty
      if (isRestoring && results.length > 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('etsy_access_token');
        const headers: Record<string, string> = {};
        if (token && token !== 'null' && token !== 'undefined') {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`/api/etsy/search?q=${encodeURIComponent(query)}`, { headers });
        if (!res.ok) {
          const text = await res.text();
          try {
            const errData = JSON.parse(text);
            throw new Error(errData.error || 'Failed to fetch');
          } catch (parseErr) {
            throw new Error(`Search Error: Backend returned an invalid response. Server might be restarting or down.`);
          }
        }
        const data = await res.json();
        setResults(data.results || []);
        setSearchType(data.type);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [query, isAuthenticated]);

  // Handle OAuth Popup Messages
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Allow messages from localhost and run.app (AI studio environment)
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { code, state } = event.data;
        try {
          setAuthLoading(true);
          const response = await fetch('/api/auth/etsy/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              code, 
              state, 
              redirect_uri: `${window.location.origin}/auth/callback` 
            })
          });
          
          if (!response.ok) throw new Error('Token exchange failed');
          
          const data = await response.json();
          if (data.access_token) {
            localStorage.setItem('etsy_access_token', data.access_token);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Auth error:", err);
          alert("Failed to authenticate with Etsy.");
        } finally {
          setAuthLoading(false);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnect = async () => {
    try {
      setAuthLoading(true);
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
      const response = await fetch(`/api/auth/etsy/url?redirect_uri=${redirectUri}`);
      if (!response.ok) throw new Error('Failed to get auth URL');
      
      const { url } = await response.json();
      
      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Please allow popups to connect your Etsy account.');
      }
    } catch (err) {
      console.error(err);
      alert('Error initializing connection.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Update local query when URL changes
  useEffect(() => {
    setLocalQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e?: React.FormEvent, queryOverride?: string) => {
    if (e) e.preventDefault();
    const searchString = typeof queryOverride === 'string' ? queryOverride : localQuery.trim();
    if (searchString) {
      setSearchParams({ q: searchString });
      if (typeof queryOverride === 'string') {
        setLocalQuery(searchString);
      }
    }
  };

  const filteredResults = results.filter(item => {
    // Price filter
    const itemPrice = item.price ? (item.price.amount / item.price.divisor) : 0;
    if (priceMin && itemPrice < parseFloat(priceMin)) return false;
    if (priceMax && itemPrice > parseFloat(priceMax)) return false;

    // Date created filter
    const timestamp = item.original_creation_timestamp || item.creation_timestamp || item.creation_tsz;
    if (dateFilter !== 'all' && timestamp) {
      const createdDate = new Date(timestamp * 1000); // Unix timestamp in seconds
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateFilter === '7days' && diffDays > 7) return false;
      if (dateFilter === '30days' && diffDays > 30) return false;
      if (dateFilter === 'year' && diffDays > 365) return false;
    }

    // Category tag filter
    if (tagFilter) {
      const searchTag = tagFilter.toLowerCase();
      const hasTag = item.tags?.some((t: string) => t.toLowerCase().includes(searchTag));
      const inTitle = item.title?.toLowerCase().includes(searchTag);
      if (!hasTag && !inTitle) return false;
    }

    return true;
  });

  const handleSort = (key: string, isNumeric: boolean) => {
    let direction: 'asc' | 'desc' = isNumeric ? 'desc' : 'asc';
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = useMemo(() => {
    if (!sortConfig) return filteredResults;
    return [...filteredResults].sort((a, b) => {
      let aVal, bVal;
      switch (sortConfig.key) {
        case 'title':
          aVal = (a.title || '').toLowerCase();
          bVal = (b.title || '').toLowerCase();
          break;
        case 'price':
          aVal = a.price ? (a.price.amount / a.price.divisor) : 0;
          bVal = b.price ? (b.price.amount / b.price.divisor) : 0;
          break;
        case 'shop':
          aVal = (a.shop?.shop_name || '').toLowerCase();
          bVal = (b.shop?.shop_name || '').toLowerCase();
          break;
        case 'views':
          aVal = a.views || 0;
          bVal = b.views || 0;
          break;
        default:
          return 0;
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredResults, sortConfig]);

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-3 h-3 text-indigo-400" /> : 
      <ArrowDown className="w-3 h-3 text-indigo-400" />;
  };

  const { topTags, priceStats } = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    let totalPrices = 0;
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let validPriceCount = 0;

    sortedResults.forEach(item => {
      // Tags
      if (Array.isArray(item.tags)) {
        item.tags.forEach((tag: string) => {
          const t = tag.toLowerCase();
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }

      // Prices
      if (item.price) {
        const itemPrice = item.price.amount / item.price.divisor;
        if (!isNaN(itemPrice)) {
          totalPrices += itemPrice;
          if (itemPrice < minPrice) minPrice = itemPrice;
          if (itemPrice > maxPrice) maxPrice = itemPrice;
          validPriceCount++;
        }
      }
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15) // Top 15 tags
      .map(([tag, count]) => ({ tag, count }));

    return {
      topTags: sortedTags,
      priceStats: {
        avg: validPriceCount > 0 ? totalPrices / validPriceCount : 0,
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice === -Infinity ? 0 : maxPrice,
        count: validPriceCount
      }
    };
  }, [sortedResults]);

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAiAnalysis = async () => {
    if (!query) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai-studio/analyze-keyword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: query,
          topTags: topTags.map(t => t.tag)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze keyword');
      setAiAnalysis(data);
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Listings & Trends</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Etsy DataGrid and trend synchronization.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <button
              onClick={handleConnect}
              disabled={authLoading}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300 disabled:opacity-50 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Store className="w-4 h-4" />
              )}
              {authLoading ? 'Connecting...' : 'Connect Shop'}
            </button>
          )}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setDensity('comfortable')}
              className={`p-1.5 rounded-md flex items-center gap-2 text-xs font-medium transition-colors ${density === 'comfortable' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Comfortable View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline px-1">Comfortable</span>
            </button>
            <button
              onClick={() => setDensity('compact')}
              className={`p-1.5 rounded-md flex items-center gap-2 text-xs font-medium transition-colors ${density === 'compact' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Compact View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline px-1">Compact</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl overflow-hidden flex-1 flex flex-col shadow-sm relative">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm flex items-center justify-between gap-4 sticky top-0 z-20">
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search by Keyword, Listing ID, or Shop Name..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !localQuery.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg text-sm font-semibold transition-colors uppercase tracking-wider"
            >
              Analyze
            </button>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </form>
          {searchType && !loading && !error && results.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => searchType === 'keyword' ? toggleKeyword(query) : undefined}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-colors ${
                    keywordFollowed 
                      ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600/30' 
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                  title={keywordFollowed ? 'Unfollow Search' : 'Follow Search'}
                >
                  {keywordFollowed ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{keywordFollowed ? 'Following' : 'Follow'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                <button
                  onClick={() => handleSort('price', sortConfig?.direction === 'desc')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${sortConfig?.key === 'price' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  Price {sortConfig?.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </button>
                <button
                  onClick={() => handleSort('views', sortConfig?.direction === 'desc')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${sortConfig?.key === 'views' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  Hot {sortConfig?.key === 'views' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
            <p className="text-sm text-zinc-500">Querying Etsy API...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-lg max-w-lg">
              <p className="font-semibold mb-1">Search Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : filteredResults.length > 0 ? (
          <div 
            id="listings-scroll-container" 
            onScroll={handleScroll}
            className="overflow-auto flex-1 relative px-6 py-6 bg-black"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {sortedResults.map((item: any) => {
                const image = item.images && item.images.length > 0 ? item.images[0].url_570xN : null;
                const shopName = item.shop ? item.shop.shop_name : 'Unknown Shop';
                const isHot = item.views > 200 || item.num_favorers > 10;
                const firsatSkoru = calculateFirsatSkoru(item);
                
                return (
                  <div key={item.listing_id} className="group relative bg-[#0a0a0a] border border-zinc-800 hover:border-indigo-500/50 rounded-xl flex flex-col overflow-hidden shadow-sm transition-all duration-300">
                    <div onClick={() => navigate(`/listings/${item.listing_id}`)} className="block relative aspect-square bg-zinc-900 overflow-hidden cursor-pointer">
                      {image ? (
                        <img src={image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-bold uppercase">No Image</div>
                      )}
                      
                      <div className="absolute top-3 left-3 z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleListing({
                              id: item.listing_id.toString(),
                              title: item.title,
                              image: image || undefined,
                              shopName: shopName
                            });
                          }}
                          className={`p-1.5 rounded shadow-lg backdrop-blur transition-colors ${
                            isListingFollowed(item.listing_id.toString()) 
                              ? 'bg-indigo-500 text-white' 
                              : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70'
                          }`}
                        >
                          {isListingFollowed(item.listing_id.toString()) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {isHot && (
                          <div className="bg-orange-500/90 backdrop-blur text-white px-2 py-1 rounded shadow-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Hot
                          </div>
                        )}
                        <div className={`backdrop-blur px-2 py-1 rounded shadow-lg text-[10px] font-bold tracking-wider ${getScoreColor(firsatSkoru)} border`}>
                          Skor {firsatSkoru}/10
                        </div>
                      </div>
                      
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/ai-studio?cloneId=${item.listing_id}`);
                          }}
                          className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold uppercase tracking-widest shadow-md transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> AI Clone
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <Link to={`/listings/${item.listing_id}`} className="block group-hover:text-indigo-400 transition-colors">
                          <h3 className="text-sm font-semibold text-zinc-200 line-clamp-2 leading-tight" title={item.title}>{item.title}</h3>
                        </Link>
                        <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                          <span className="text-indigo-400 font-bold font-mono text-lg tracking-tight">
                            {item.price?.currency_code} {(item.price?.amount / item.price?.divisor).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2 text-xs font-medium bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800">
                            <span className="text-emerald-400 flex items-center gap-1" title="Views"><TrendingUp className="w-3 h-3" />{item.views || 0}</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-rose-400" title="Favorites">♥ {item.num_favorers || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between">
                        {item.shop ? (
                          <Link to={`/shops/${item.shop.shop_id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity max-w-[70%]">
                            <div className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                              {shopName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-zinc-400 text-xs font-medium truncate">{shopName}</span>
                          </Link>
                        ) : (
                          <span className="text-zinc-500 text-xs font-medium">Unknown Shop</span>
                        )}
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="View on Etsy"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* AI Analysis Section */}
            {!loading && !error && filteredResults.length > 0 && (
              <div className="mt-8 bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 shadow-sm max-w-5xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-zinc-800 gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Secondary Stats & AI Analysis</h2>
                  </div>
                  {!aiAnalysis && (
                    <button
                      onClick={handleAiAnalysis}
                      disabled={aiLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[11px] font-bold rounded flex items-center gap-2 transition-colors uppercase tracking-wider shadow-sm"
                    >
                      {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      {aiLoading ? 'Analyzing...' : 'Analyze Niche'}
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Top Keyword Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {topTags.map(t => (
                        <Link
                          key={t.tag}
                          to={`/listings?q=${encodeURIComponent(t.tag)}`}
                          className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                        >
                          {t.tag}
                          <span className="text-zinc-500 font-mono">{t.count}</span>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Price Distribution</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Min</p>
                          <p className="text-sm text-zinc-200 font-mono">${priceStats.min.toFixed(2)}</p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center border-b-2 border-b-indigo-500">
                          <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1 font-bold">Avg</p>
                          <p className="text-base text-zinc-200 font-mono font-bold">${priceStats.avg.toFixed(2)}</p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Max</p>
                          <p className="text-sm text-zinc-200 font-mono">${priceStats.max.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                    {aiError && (
                      <p className="text-xs text-red-400 mb-4">{aiError}</p>
                    )}
                    
                    {aiAnalysis ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-4">
                          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Opportunity Score</h3>
                          <span className="text-2xl font-black font-mono text-white">{aiAnalysis.opportunityScore}<span className="text-sm text-zinc-500 font-sans font-medium">/10</span></span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black/30 rounded p-3 border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Competition</p>
                            <p className="text-sm font-medium text-zinc-300">{aiAnalysis.competitionLevel}</p>
                          </div>
                          <div className="bg-black/30 rounded p-3 border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Search Intent</p>
                            <p className="text-xs font-medium text-zinc-400 line-clamp-2" title={aiAnalysis.searchIntent}>{aiAnalysis.searchIntent}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Reasoning</p>
                          <p className="text-sm text-zinc-300 leading-relaxed bg-black/30 rounded p-3 border border-zinc-800/50">{aiAnalysis.scoreReasoning}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Recommended Long-Tail</p>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.recommendedLongTail?.map((lt: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded text-xs">{lt}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                       <div className="h-full flex items-center justify-center text-zinc-500 text-sm italic">
                         Run AI analysis to reveal niche opportunity score and details.
                       </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-zinc-400 mb-2 font-medium">No results found</p>
              <p className="text-sm text-zinc-600">Try searching for a keyword, listing ID, or shop name in the top bar.</p>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Filter Panel Overlay */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Slide-out Filter Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-[#0a0a0a] border-l border-zinc-800 p-6 shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-400" />
            Filters
          </h3>
          <button onClick={() => setIsFilterOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Price Range</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-md pl-7 pr-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
              <span className="text-zinc-600">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-md pl-7 pr-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Date Created */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Date Created</label>
            <select 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">Any time</option>
              <option value="7days">Past 7 days</option>
              <option value="30days">Past 30 days</option>
              <option value="year">Past year</option>
            </select>
          </div>

          {/* Category / Tags */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Category Tag</label>
            <input 
              type="text" 
              placeholder="e.g. vintage, digital..." 
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none" 
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button 
              onClick={() => { setPriceMin(''); setPriceMax(''); setDateFilter('all'); setTagFilter(''); }}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-md transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

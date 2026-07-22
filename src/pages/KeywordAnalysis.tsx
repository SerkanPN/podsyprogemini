import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ExternalLink, 
  Loader2, 
  Filter,
  ChevronRight,
  Heart
} from 'lucide-react';
import { useFollowStore } from '../stores/useFollowStore';

export default function KeywordAnalysis() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || 'soundwave'; // Default search query

  const { toggleListing, isListingFollowed, toggleKeyword, isKeywordFollowed } = useFollowStore();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort States
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Default closed as requested
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [physicalDigital, setPhysicalDigital] = useState<'all' | 'physical' | 'digital'>('all');
  const [shipsFromFilter, setShipsFromFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<string>('views');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch results from backend when search query changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('etsy_access_token');
        const headers: Record<string, string> = {};
        if (token && token !== 'null' && token !== 'undefined') {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const url = `/api/etsy/search?q=${encodeURIComponent(query)}&limit=100`;
        const res = await fetch(url, { headers });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }
        const data = await res.json();
        setResults(data.results || []);
        setTotalResults(data.count !== undefined ? data.count : (data.results?.length || 0));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [query]);

  // Get item country of origin helper
  const getItemCountry = (item: any) => {
    return item.origin_country_name || item.ships_from || null;
  };

  // Dynamically extract countries present in the search results
  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    results.forEach(item => {
      const country = getItemCountry(item);
      if (country) {
        countries.add(country);
      }
    });
    return Array.from(countries).sort();
  }, [results]);

  // Filter Logic
  const filteredResults = useMemo(() => {
    return results.filter(item => {
      // Price Filter
      const itemPrice = item.price ? (item.price.amount / item.price.divisor) : 0;
      if (priceMin && itemPrice < parseFloat(priceMin)) return false;
      if (priceMax && itemPrice > parseFloat(priceMax)) return false;

      // Digital vs Physical
      const isDigital = item.is_digital || item.is_downloadable || item.tags?.includes('digital') || item.tags?.includes('download');
      if (physicalDigital === 'physical' && isDigital) return false;
      if (physicalDigital === 'digital' && !isDigital) return false;

      // Ships From country filter
      const shipsFrom = getItemCountry(item);
      if (shipsFromFilter !== 'all' && shipsFrom !== shipsFromFilter) return false;

      return true;
    });
  }, [results, priceMin, priceMax, physicalDigital, shipsFromFilter]);

  // Sorting Logic
  const sortedResults = useMemo(() => {
    const items = [...filteredResults];
    return items.sort((a, b) => {
      const getVal = (item: any, key: string) => {
        switch (key) {
          case 'views':
            return item.views || 0;
          case 'favs':
            return item.num_favorers || item.favorites || 0;
          case 'price_low':
          case 'price_high':
            return item.price ? (item.price.amount / item.price.divisor) : 0;
          case 'reviews':
            // If reviews count doesn't exist, we default to 0
            return item.reviews_count || 0;
          case 'newest':
            return item.original_creation_timestamp || item.creation_timestamp || item.creation_tsz || 0;
          default:
            return 0;
        }
      };

      const valA = getVal(a, sortKey);
      const valB = getVal(b, sortKey);

      if (sortKey === 'price_low') {
        return valA - valB;
      } else {
        return valB - valA; // Descending for views, favs, price_high, reviews, newest
      }
    });
  }, [filteredResults, sortKey]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedResults.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedResults, currentPage]);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Tag & Control Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full text-xs font-semibold hover:bg-zinc-800 hover:text-white flex items-center gap-1.5 transition-all shrink-0"
          >
            <Filter className="w-3 h-3 text-[#F1641E]" />
            {isFilterOpen ? 'Hide filters' : 'Show filters'}
          </button>
        </div>

        {/* Items count & Sort Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-6">
          <span className="text-xs text-zinc-400 font-medium">
            {totalResults !== null ? totalResults.toLocaleString() : filteredResults.length} items
          </span>

          <div className="flex items-center gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="bg-[#18181b] border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#F1641E] font-semibold"
            >
              <option value="views">Most relevant (Views)</option>
              <option value="favs">Most favorites</option>
              <option value="price_low">Price: low to high</option>
              <option value="price_high">Price: high to low</option>
              <option value="reviews">Top reviews</option>
              <option value="newest">Newest</option>
            </select>

            <button
              onClick={() => toggleKeyword(query)}
              className="p-2 bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 transition-all flex items-center justify-center"
              title={isKeywordFollowed(query) ? "Unfollow keyword" : "Follow keyword"}
            >
              <Heart className={`w-4 h-4 ${isKeywordFollowed(query) ? 'fill-[#ff3b30] text-[#ff3b30]' : 'text-zinc-400'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Left Sidebar Filters */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Sidebar Filter Panel (Etsy style) */}
        {isFilterOpen && (
          <div className="w-64 shrink-0 bg-[#161616] border border-zinc-800 rounded-xl p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#F1641E]" />
                Filters
              </h3>
              <button 
                onClick={() => { 
                  setPriceMin(''); 
                  setPriceMax(''); 
                  setPhysicalDigital('all');
                  setShipsFromFilter('all');
                }}
                className="text-[11px] text-zinc-500 hover:text-white underline font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Price Range</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceMin} 
                    onChange={e => setPriceMin(e.target.value)} 
                    className="w-full bg-[#222] border border-zinc-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white focus:border-[#F1641E] focus:outline-none" 
                  />
                </div>
                <span className="text-zinc-600">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceMax} 
                    onChange={e => setPriceMax(e.target.value)} 
                    className="w-full bg-[#222] border border-zinc-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white focus:border-[#F1641E] focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Item Format */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Item Format</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200">
                  <input 
                    type="radio" 
                    name="format" 
                    checked={physicalDigital === 'all'} 
                    onChange={() => setPhysicalDigital('all')}
                    className="accent-[#F1641E]"
                  />
                  <span>All items</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200">
                  <input 
                    type="radio" 
                    name="format" 
                    checked={physicalDigital === 'physical'} 
                    onChange={() => setPhysicalDigital('physical')}
                    className="accent-[#F1641E]"
                  />
                  <span>Physical items only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200">
                  <input 
                    type="radio" 
                    name="format" 
                    checked={physicalDigital === 'digital'} 
                    onChange={() => setPhysicalDigital('digital')}
                    className="accent-[#F1641E]"
                  />
                  <span>Digital items only</span>
                </label>
              </div>
            </div>

            {/* Ships From (Dynamic Countries based on results) */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Ships From</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200">
                  <input 
                    type="radio" 
                    name="shipsFrom" 
                    checked={shipsFromFilter === 'all'} 
                    onChange={() => setShipsFromFilter('all')}
                    className="accent-[#F1641E]"
                  />
                  <span>Anywhere</span>
                </label>
                {uniqueCountries.map(country => (
                  <label key={country} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200">
                    <input 
                      type="radio" 
                      name="shipsFrom" 
                      checked={shipsFromFilter === country} 
                      onChange={() => setShipsFromFilter(country)}
                      className="accent-[#F1641E]"
                    />
                    <span>{country}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Listings Grid Area */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-[#F1641E] animate-spin mb-4" />
            <p className="text-sm text-zinc-500">Retrieving Etsy search data...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl max-w-lg">
              <p className="font-semibold mb-1">Search Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : sortedResults.length > 0 ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedResults.map((item) => {
                const image = item.images && item.images.length > 0 ? item.images[0].url_570xN : null;
                const shopName = item.shop?.shop_name || item.shop_name || `Shop #${item.shop_id || 'Unknown'}`;
                
                // Read actual parameters directly from item
                const viewsCount = item.views !== undefined ? item.views : 'N/A';
                const favsCount = item.num_favorers !== undefined ? item.num_favorers : (item.favorites !== undefined ? item.favorites : 0);
                
                // Badges
                const isDigital = item.is_digital || item.is_downloadable || item.tags?.includes('digital') || item.tags?.includes('download');
                
                // Prices (strictly from API v3)
                const price = item.price ? (item.price.amount / item.price.divisor) : 0;
                const currency = item.price?.currency_code === 'USD' ? '$' : (item.price?.currency_code || 'Rp');

                return (
                  <div 
                    key={item.listing_id} 
                    className="group flex flex-col bg-[#161616] border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden transition-all duration-300 relative font-sans text-left"
                  >
                    {/* Image wrapper */}
                    <div 
                      onClick={() => navigate(`/listings/${item.listing_id}`)}
                      className="relative aspect-square w-full bg-zinc-900 cursor-pointer overflow-hidden"
                    >
                      {image ? (
                        <img 
                          src={image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-bold uppercase">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details section */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        {/* Title */}
                        <Link to={`/listings/${item.listing_id}`} className="block hover:underline">
                          <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-tight min-h-[2.5rem]">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Store name line */}
                        <div className="text-xs text-zinc-400">
                          <span 
                            className="truncate hover:text-white transition-colors cursor-pointer font-medium" 
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/shops/${item.shop_id}`);
                            }}
                          >
                            By {shopName}
                          </span>
                        </div>

                        {/* Real Stats Row (Views & Favs) */}
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                          <span>Views: <span className="text-zinc-200">{viewsCount}</span></span>
                          <span className="text-zinc-700">•</span>
                          <span>Favs: <span className="text-zinc-200">{favsCount}</span></span>
                        </div>

                        {/* Digital download label */}
                        {isDigital && (
                          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                            <Download className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
                            <span>Digital download</span>
                          </div>
                        )}

                        {/* Pricing Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[#F1641E] font-bold text-base font-mono">
                            {currency} {price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action buttons */}
                      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2 mt-auto">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleListing({
                              id: item.listing_id.toString(),
                              title: item.title,
                              image: image || undefined,
                              shopName: shopName
                            });
                          }}
                          className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            isListingFollowed(item.listing_id.toString()) 
                              ? 'bg-[#F1641E] border-[#F1641E] text-white' 
                              : 'bg-transparent border-zinc-700 text-zinc-300 hover:border-white hover:text-white'
                          }`}
                        >
                          {isListingFollowed(item.listing_id.toString()) ? '✓ Following' : '+ Add to follow'}
                        </button>

                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            const words = item.title.split(' ');
                            const searchWord = words.length > 2 ? words[1] : words[0];
                            setSearchParams({ q: searchWord });
                          }}
                          className="py-1.5 px-3 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40 text-zinc-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                        >
                          More <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 mb-6 font-mono">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-bold transition-colors uppercase tracking-wider"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all border ${
                      currentPage === page
                        ? 'bg-[#F1641E] border-[#F1641E] text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-bold transition-colors uppercase tracking-wider"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center bg-[#161616] border border-zinc-800 p-8 rounded-xl max-w-md">
            <p className="text-zinc-300 mb-2 font-semibold">No results found</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Try searching for a different keyword or listing ID in the search bar above.
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

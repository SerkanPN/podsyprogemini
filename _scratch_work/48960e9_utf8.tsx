import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Loader2, ArrowLeft, Heart, Eye, Package, ShieldCheck, TrendingUp, Hash, Bookmark, BookmarkCheck, Sparkles, Star, Check, ChevronRight, ChevronDown, ChevronLeft, MapPin } from 'lucide-react';
import { useFollowStore } from '../stores/useFollowStore';

export default function WebListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="bg-[#0a0a0a] text-zinc-200 font-sans min-h-[calc(100vh-64px)] pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs text-zinc-500 mb-6 space-x-1">
          <button onClick={() => navigate(-1)} className="hover:text-zinc-300 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Listings
          </button>
          <ChevronRight className="w-3 h-3" />
          <Link to="#" className="hover:text-zinc-300">Listing {id}</Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN - Images & Reviews */}
          <div className="w-full lg:w-[65%]">
            {/* Image Section */}
            <div className="flex gap-4 mb-10">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-2 w-16 shrink-0 h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {images?.map((img: any, i: number) => (
                  <div key={i} className="w-16 h-16 bg-zinc-900 rounded-md cursor-pointer border border-transparent hover:border-zinc-500 overflow-hidden shrink-0">
                    <img src={img.url_75x75 || img.url_170x135} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="relative w-full aspect-square md:aspect-[4/3] bg-zinc-900 rounded-xl overflow-hidden group border border-zinc-800">
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hidden group-hover:flex">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hidden group-hover:flex">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-md">
                  <Heart className="w-5 h-5" />
                </button>
                {image ? (
                  <img src={image} alt={title} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Reviews for this item</h2>
              
              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white">4.9</span>
                  <div>
                    <div className="flex text-yellow-500 mb-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <span className="text-sm text-zinc-400 underline cursor-pointer hover:text-zinc-300">(704 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Review Filters */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                {['Suggested', 'Quality (315)', 'Seller service (243)', 'Shipping (171)'].map((filter, i) => (
                  <button key={i} className="px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-sm font-medium hover:bg-zinc-800 text-zinc-300 whitespace-nowrap transition-colors">
                    {filter}
                  </button>
                ))}
              </div>

              {/* Sample Review */}
              <div className="border-b border-zinc-800 py-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">V</div>
                    <span className="font-medium text-zinc-200">Verday</span>
                    <span>Jul 24, 2026</span>
                  </div>
                </div>
                <p className="text-zinc-300 mt-2 leading-relaxed">The item was exactly what I wanted as a gift. Perfect gift for pet parents.</p>
              </div>
            </div>

            {/* Shop Profile Card */}
            <div className="mt-12 p-6 border border-zinc-800 bg-zinc-900/30 rounded-2xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-5">
                  <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                    {shop?.shop_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-white mb-1">{shop?.shop_name || 'Etsy Shop'}</h3>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="text-zinc-400">Shop ID: {shop?.shop_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Star className="w-4 h-4 fill-white text-white" />
                      <span className="text-white">4.9</span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-zinc-300">{(shop?.transaction_sold_count || 139700).toLocaleString()} sales</span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-zinc-300">6 years on Etsy</span>
                    </div>
                  </div>
                </div>
                <button className="px-5 py-2.5 border border-zinc-600 rounded-full font-bold hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                  <Heart className="w-4 h-4" /> Follow shop
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Details & Cart */}
          <div className="w-full lg:w-[35%] lg:pl-6 mt-8 lg:mt-0">
            {views > 0 && (
              <div className="text-red-400 font-medium text-sm mb-3">
                In demand. This item has {views.toLocaleString()} views.
              </div>
            )}
            
            <div className="mb-3 flex items-end gap-3">
              <span className="text-3xl font-bold text-green-400">{priceFormatted}</span>
              <span className="text-zinc-500 line-through pb-1">${(price ? (price.amount / price.divisor) * 2 : 0).toFixed(2)}</span>
            </div>
            
            <div className="text-green-400 text-sm font-medium mb-5">
              50% off <span className="text-zinc-500 ml-1 font-normal">Sale ends in 17:59:34</span>
            </div>

            <h1 className="text-[22px] leading-snug font-light mb-4 text-zinc-100">
              {title}
            </h1>
            
            <div className="flex items-center gap-2 mb-8">
              <span className="font-bold text-white">{shop?.shop_name}</span>
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>

            <div className="space-y-3 mb-8 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300"><span className="font-bold text-white">Arrives soon!</span> Get it by <span className="font-bold underline text-white">Jul 30-Aug 6</span> if you order today</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300">Returns & exchanges accepted</p>
              </div>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-bold mb-2 text-white">Quantity</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-lg p-3.5 pr-10 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                    <option>{quantity || 1}</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-10">
              <button className="w-full py-4 rounded-full border-2 border-white text-white font-bold text-base hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                Buy it now
              </button>
              <button className="w-full py-4 rounded-full bg-white text-black font-bold text-base hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                Add to cart
              </button>
              <button className="w-full py-3.5 font-bold text-base flex items-center justify-center gap-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-300">
                <Heart className="w-5 h-5" /> Add to collection
              </button>
            </div>

            {/* Item Details Accordion */}
            <div className="border-t border-zinc-800">
              <button className="w-full py-5 flex items-center justify-between font-bold text-lg text-left text-white hover:text-zinc-300 transition-colors">
                Item details
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="pb-6">
                <h4 className="font-bold mb-3 text-white">Highlights</h4>
                <ul className="space-y-2.5 mb-5 text-sm text-zinc-300">
                  <li className="flex gap-3 items-center"><Sparkles className="w-4 h-4 text-yellow-500 shrink-0"/> Designed by <span className="font-bold text-white">{shop?.shop_name}</span></li>
                  <li className="flex gap-3 items-center"><Package className="w-4 h-4 text-indigo-400 shrink-0"/> Materials: digital, custom, fast shipping</li>
                  <li className="flex gap-3 items-center"><Eye className="w-4 h-4 text-emerald-400 shrink-0"/> {views} total views</li>
                  <li className="flex gap-3 items-center"><Heart className="w-4 h-4 text-rose-400 shrink-0"/> {num_favorers} favorites</li>
                </ul>
                <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap font-light max-h-96 overflow-y-auto custom-scrollbar pr-2">
                  {description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You may also like - Tags Section */}
        {tags && tags.length > 0 && (
          <div className="mt-20 pt-10 border-t border-zinc-800">
            <h2 className="text-2xl font-bold mb-8 text-white tracking-tight">Explore related searches</h2>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag: string, index: number) => (
                <Link 
                  key={index}
                  to={`/listings?q=${encodeURIComponent(tag)}`}
                  className="px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg group-hover:bg-zinc-700 transition-colors flex items-center justify-center shrink-0">
                    <Hash className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  </div>
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

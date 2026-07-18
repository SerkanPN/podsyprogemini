import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFollowStore } from '../stores/useFollowStore';
import { Search, Package, Store, BookmarkX, ExternalLink, ArrowRight, FolderPlus, Folder, MoreVertical } from 'lucide-react';

export default function Followed() {
  const { 
    keywords, 
    listings, 
    shops, 
    collections,
    toggleKeyword, 
    toggleListing, 
    toggleShop,
    createCollection,
    deleteCollection,
    assignListingToCollection,
    assignShopToCollection
  } = useFollowStore();

  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState<'listing' | 'shop' | null>(null);

  const followedKeywords = Object.values(keywords).sort((a, b) => b.addedAt - a.addedAt);
  const followedListings = Object.values(listings).sort((a, b) => b.addedAt - a.addedAt);
  const followedShops = Object.values(shops).sort((a, b) => b.addedAt - a.addedAt);

  const listingCollections = Object.values(collections).filter(c => c.type === 'listing');
  const shopCollections = Object.values(collections).filter(c => c.type === 'shop');

  const handleCreateCollection = (type: 'listing' | 'shop') => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim(), type);
      setNewCollectionName('');
      setShowNewCollection(null);
    }
  };

  return (
    <div className="space-y-8 flex flex-col h-full overflow-y-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Following & Collections</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          Organize your saved keywords, listings, and shops into collections.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          Keywords ({followedKeywords.length})
        </h2>
        
        {followedKeywords.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No keywords followed yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {followedKeywords.map((kw) => (
              <div key={kw.id} className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                <Link to={`/listings?q=${encodeURIComponent(kw.id)}`} className="text-zinc-200 font-medium hover:text-indigo-400 transition-colors flex-1 truncate mr-4">
                  {kw.id}
                </Link>
                <button 
                  onClick={() => toggleKeyword(kw.id)}
                  className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Unfollow"
                >
                  <BookmarkX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Listings ({followedListings.length})
          </h2>
          <button 
            onClick={() => setShowNewCollection(showNewCollection === 'listing' ? null : 'listing')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            New Collection
          </button>
        </div>

        {showNewCollection === 'listing' && (
          <div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
            <input 
              type="text"
              value={newCollectionName}
              onChange={e => setNewCollectionName(e.target.value)}
              placeholder="Collection name (e.g., Halloween Ideas)"
              className="flex-1 bg-black border border-zinc-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleCreateCollection('listing')}
            />
            <button 
              onClick={() => handleCreateCollection('listing')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Create
            </button>
          </div>
        )}
        
        {followedListings.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No listings followed yet.</p>
        ) : (
          <div className="space-y-8">
            {listingCollections.map(collection => {
              const collectionListings = followedListings.filter(l => (l.collectionId || 'default-listing') === collection.id);
              if (collectionListings.length === 0 && collection.id !== 'default-listing') return null;
              
              return (
                <div key={collection.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Folder className="w-4 h-4 text-zinc-500" />
                      {collection.name} <span className="text-zinc-600 text-xs">({collectionListings.length})</span>
                    </h3>
                    {collection.id !== 'default-listing' && (
                      <button onClick={() => deleteCollection(collection.id)} className="text-[10px] text-zinc-500 hover:text-red-400 uppercase tracking-wider font-bold">Delete Collection</button>
                    )}
                  </div>
                  
                  {collectionListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {collectionListings.map((listing) => (
                        <div key={listing.id} className="bg-[#0d0d0d] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors flex flex-col group relative">
                          <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-all">
                            <select 
                              className="text-xs bg-zinc-900 text-zinc-300 border border-zinc-700 rounded p-1 outline-none max-w-[100px]"
                              value={listing.collectionId || 'default-listing'}
                              onChange={(e) => assignListingToCollection(listing.id, e.target.value)}
                            >
                              {listingCollections.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                toggleListing(listing);
                              }}
                              className="bg-zinc-900 p-1.5 rounded text-zinc-400 hover:text-red-400"
                              title="Unfollow"
                            >
                              <BookmarkX className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <Link to={`/listings/${listing.id}`} className="flex flex-col flex-1">
                            <div className="aspect-square bg-zinc-900 overflow-hidden">
                              {listing.image ? (
                                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Image</div>
                              )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                              <p className="text-sm text-zinc-200 font-medium line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
                                {listing.title}
                              </p>
                              {listing.shopName && (
                                <p className="text-xs text-zinc-500 mt-auto">{listing.shopName}</p>
                              )}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-600 italic">Empty collection.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" />
            Shops ({followedShops.length})
          </h2>
          <button 
            onClick={() => setShowNewCollection(showNewCollection === 'shop' ? null : 'shop')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            New Collection
          </button>
        </div>

        {showNewCollection === 'shop' && (
          <div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
            <input 
              type="text"
              value={newCollectionName}
              onChange={e => setNewCollectionName(e.target.value)}
              placeholder="Collection name (e.g., Competitors)"
              className="flex-1 bg-black border border-zinc-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleCreateCollection('shop')}
            />
            <button 
              onClick={() => handleCreateCollection('shop')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Create
            </button>
          </div>
        )}

        {followedShops.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No shops followed yet.</p>
        ) : (
          <div className="space-y-8">
            {shopCollections.map(collection => {
              const collectionShops = followedShops.filter(s => (s.collectionId || 'default-shop') === collection.id);
              if (collectionShops.length === 0 && collection.id !== 'default-shop') return null;

              return (
                <div key={collection.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Folder className="w-4 h-4 text-zinc-500" />
                      {collection.name} <span className="text-zinc-600 text-xs">({collectionShops.length})</span>
                    </h3>
                    {collection.id !== 'default-shop' && (
                      <button onClick={() => deleteCollection(collection.id)} className="text-[10px] text-zinc-500 hover:text-red-400 uppercase tracking-wider font-bold">Delete Collection</button>
                    )}
                  </div>
                  
                  {collectionShops.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {collectionShops.map((shop) => (
                        <div key={shop.id} className="bg-[#0d0d0d] border border-zinc-800 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors group relative">
                          <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-all">
                            <select 
                              className="text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-700 rounded p-1 outline-none max-w-[80px]"
                              value={shop.collectionId || 'default-shop'}
                              onChange={(e) => assignShopToCollection(shop.id, e.target.value)}
                            >
                              {shopCollections.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => toggleShop(shop)}
                              className="bg-zinc-900 p-1 rounded text-zinc-400 hover:text-red-400"
                              title="Unfollow"
                            >
                              <BookmarkX className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="w-12 h-12 rounded-lg bg-zinc-900 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {shop.image ? (
                              <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 mr-8">
                            <Link to={`/shops/${shop.id}`} className="text-zinc-200 font-medium truncate block hover:text-indigo-400 transition-colors">
                              {shop.name}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-600 italic">Empty collection.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

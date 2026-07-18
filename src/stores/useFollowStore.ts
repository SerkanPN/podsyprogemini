import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Collection {
  id: string;
  name: string;
  type: 'listing' | 'shop';
}

export interface FollowedKeyword {
  id: string;
  addedAt: number;
}

export interface FollowedListing {
  id: string;
  title: string;
  image?: string;
  shopName?: string;
  addedAt: number;
  collectionId?: string;
}

export interface FollowedShop {
  id: string;
  name: string;
  image?: string;
  addedAt: number;
  collectionId?: string;
}

interface FollowState {
  keywords: Record<string, FollowedKeyword>;
  listings: Record<string, FollowedListing>;
  shops: Record<string, FollowedShop>;
  collections: Record<string, Collection>;
  
  toggleKeyword: (keyword: string) => void;
  toggleListing: (listing: Omit<FollowedListing, 'addedAt'>) => void;
  toggleShop: (shop: Omit<FollowedShop, 'addedAt'>) => void;
  
  isKeywordFollowed: (keyword: string) => boolean;
  isListingFollowed: (id: string) => boolean;
  isShopFollowed: (id: string) => boolean;

  createCollection: (name: string, type: 'listing' | 'shop') => string;
  deleteCollection: (id: string) => void;
  assignListingToCollection: (listingId: string, collectionId: string | undefined) => void;
  assignShopToCollection: (shopId: string, collectionId: string | undefined) => void;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      keywords: {},
      listings: {},
      shops: {},
      collections: {
        'default-listing': { id: 'default-listing', name: 'General', type: 'listing' },
        'default-shop': { id: 'default-shop', name: 'General', type: 'shop' }
      },
      
      toggleKeyword: (keyword: string) => {
        const lowerKeyword = keyword.toLowerCase();
        set((state) => {
          const newKeywords = { ...state.keywords };
          if (newKeywords[lowerKeyword]) {
            delete newKeywords[lowerKeyword];
          } else {
            newKeywords[lowerKeyword] = {
              id: lowerKeyword,
              addedAt: Date.now()
            };
          }
          return { keywords: newKeywords };
        });
      },
      
      toggleListing: (listing: Omit<FollowedListing, 'addedAt'>) => {
        set((state) => {
          const newListings = { ...state.listings };
          if (newListings[listing.id]) {
            delete newListings[listing.id];
          } else {
            newListings[listing.id] = { ...listing, addedAt: Date.now(), collectionId: 'default-listing' };
          }
          return { listings: newListings };
        });
      },
      
      toggleShop: (shop: Omit<FollowedShop, 'addedAt'>) => {
        set((state) => {
          const newShops = { ...state.shops };
          if (newShops[shop.id]) {
            delete newShops[shop.id];
          } else {
            newShops[shop.id] = { ...shop, addedAt: Date.now(), collectionId: 'default-shop' };
          }
          return { shops: newShops };
        });
      },
      
      isKeywordFollowed: (keyword: string) => {
        return !!get().keywords[keyword.toLowerCase()];
      },
      
      isListingFollowed: (id: string) => {
        return !!get().listings[id];
      },
      
      isShopFollowed: (id: string) => {
        return !!get().shops[id];
      },

      createCollection: (name: string, type: 'listing' | 'shop') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          collections: {
            ...state.collections,
            [id]: { id, name, type }
          }
        }));
        return id;
      },

      deleteCollection: (id: string) => {
        set((state) => {
          const newCollections = { ...state.collections };
          delete newCollections[id];

          // Move items to default collection
          const newListings = { ...state.listings };
          Object.values(newListings).forEach(item => {
            if (item.collectionId === id) item.collectionId = 'default-listing';
          });

          const newShops = { ...state.shops };
          Object.values(newShops).forEach(item => {
            if (item.collectionId === id) item.collectionId = 'default-shop';
          });

          return { collections: newCollections, listings: newListings, shops: newShops };
        });
      },

      assignListingToCollection: (listingId: string, collectionId: string | undefined) => {
        set((state) => {
          if (!state.listings[listingId]) return state;
          return {
            listings: {
              ...state.listings,
              [listingId]: { ...state.listings[listingId], collectionId }
            }
          };
        });
      },

      assignShopToCollection: (shopId: string, collectionId: string | undefined) => {
        set((state) => {
          if (!state.shops[shopId]) return state;
          return {
            shops: {
              ...state.shops,
              [shopId]: { ...state.shops[shopId], collectionId }
            }
          };
        });
      }
    }),
    {
      name: 'podsy-following-storage',
    }
  )
);

import { useState } from 'react';
import { cn } from '../lib/utils';

export default function MyFavs() {
  const [activeTab, setActiveTab] = useState<'tags' | 'listings' | 'shops'>('tags');

  const tabs = [
    { id: 'tags', label: 'Tags' },
    { id: 'listings', label: 'Listings' },
    { id: 'shops', label: 'Shops' }
  ];

  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">My Favs</h1>
      <div className="flex space-x-2 border-b border-zinc-800 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-t-md font-medium transition-colors",
              activeTab === tab.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-zinc-900 p-6 rounded-b-lg rounded-tr-lg border border-zinc-800">
        {activeTab === 'tags' && <div>Tags Content</div>}
        {activeTab === 'listings' && <div>Listings Content</div>}
        {activeTab === 'shops' && <div>Shops Content</div>}
      </div>
    </div>
  );
}
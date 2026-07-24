import os

pages = {
    'Profile.tsx': '''export default function Profile() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Profil</h1>
      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <p>Ad Soyad: Kullanıcı Adı</p>
        <p>E-posta: email@example.com</p>
        <p>Telefon: +90 555 555 5555</p>
        <p>Mağaza Adı: Podsy Store</p>
        <p>Üyelik Durumu: Premium</p>
      </div>
    </div>
  );
}''',
    'MyFavs.tsx': '''import { useState } from 'react';
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
}''',
    'TrendAnalysis.tsx': '''export default function TrendAnalysis() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Trend Analizi</h1></div>; }''',
    'ListingAnalysis.tsx': '''export default function ListingAnalysis() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Listing Analizi</h1>
      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Listing ID veya Linki Girin..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">Analiz Et</button>
      </div>
    </div>
  );
}''',
    'ShopAnalysis.tsx': '''export default function ShopAnalysis() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Shop Analizi</h1>
      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Mağaza Adı veya Linki Girin..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">Analiz Et</button>
      </div>
    </div>
  );
}''',
    'CompetitorAnalysis.tsx': '''export default function CompetitorAnalysis() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Rakip Analizi</h1></div>; }''',
    'MarketAnalysis.tsx': '''export default function MarketAnalysis() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Pazar Analizi</h1></div>; }''',
    'MockupStudio.tsx': '''export default function MockupStudio() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Mock-up Studio</h1></div>; }''',
    'IdeaStudio.tsx': '''export default function IdeaStudio() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Idea Studio</h1></div>; }''',
    'CloneStudio.tsx': '''export default function CloneStudio() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Clone Studio</h1></div>; }''',
    'ReportStudio.tsx': '''export default function ReportStudio() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Report Studio</h1></div>; }'''
}

for filename, content in pages.items():
    with open(f"src/pages/{filename}", "w", encoding="utf-8") as f:
        f.write(content)

print("Pages created successfully.")

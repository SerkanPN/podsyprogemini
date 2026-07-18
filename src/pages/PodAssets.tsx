import { Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PodAsset {
  id: string;
  title: string;
  imageUrl: string;
  mockupUrls?: string[];
  createdAt: string;
}

export default function PodAssets() {
  const [assets, setAssets] = useState<PodAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pod-assets')
      .then(res => res.json())
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load assets", err);
        setLoading(false);
      });
  }, []);

  const handleDownload = async (asset: PodAsset) => {
    try {
      const res = await fetch(asset.imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${asset.title?.replace(/\s+/g, '_').toLowerCase() || 'design'}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">POD Assets Library</h1>
        <p className="text-zinc-500 mt-1 text-sm">Generated designs and mockups.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <ImageIcon className="w-12 h-12 text-zinc-600 mb-4" />
          <h2 className="text-lg font-semibold text-white">No Assets Found</h2>
          <p className="text-zinc-400 mt-2 text-sm max-w-md">You haven't generated any designs yet. Head over to the AI Studio to create your first product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group flex flex-col">
              <div className="aspect-square bg-[#0d0d0d] relative flex items-center justify-center overflow-hidden">
                <img 
                  src={asset.mockupUrls?.[0] || asset.imageUrl} 
                  alt={asset.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity backdrop-blur-sm">
                  <button 
                    onClick={() => handleDownload(asset)}
                    className="bg-white text-black p-2.5 rounded-full hover:scale-105 transition-transform shadow-lg"
                    title="Download Design File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-zinc-800/50 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white truncate" title={asset.title}>{asset.title || "Untitled Design"}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{new Date(asset.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-wider border border-indigo-500/20">Design</span>
                  {asset.mockupUrls && asset.mockupUrls.length > 0 && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wider border border-emerald-500/20">{asset.mockupUrls.length} Mockups</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Download } from 'lucide-react';

export default function PodAssets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">POD Assets Library</h1>
        <p className="text-zinc-500 mt-1 text-sm">CMYK converted, 300 DPI ready-to-print designs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
            <div className="aspect-square bg-[#0d0d0d] relative flex items-center justify-center">
              <span className="text-zinc-700 text-xs uppercase font-bold tracking-widest">Asset {i}</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity backdrop-blur-sm">
                <button className="bg-white text-black p-2.5 rounded-full hover:scale-105 transition-transform shadow-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800/50">
              <h3 className="text-sm font-medium text-white truncate">Design_Asset_{i}_CMYK.png</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase tracking-wider">4500x5400</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase tracking-wider">300 DPI</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

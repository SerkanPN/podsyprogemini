import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSocketStore } from '../stores/useSocketStore';
import { Wand2, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AIStudio() {
  const [searchParams] = useSearchParams();
  const [cloneId, setCloneId] = useState(searchParams.get('cloneId') || '');
  const [listingInfo, setListingInfo] = useState<any>(null);
  const [loadingListing, setLoadingListing] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const tasks = useSocketStore(state => state.tasks);

  const handleGenerate = async (info?: any) => {
    try {
      const res = await fetch('/api/ai-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingInfo: info || listingInfo })
      });
      
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      
      const data = await res.json();
      if (data.jobId) {
        setActiveJobId(data.jobId);
      } else {
        alert("Failed to queue generation. Please try again.");
      }
    } catch (e) {
      console.warn('Failed to start generation:', e);
      alert("Failed to start generation. The server might be restarting or the listing data is too large.");
    }
  };

  useEffect(() => {
    const c = searchParams.get('cloneId');
    if (c) {
      setCloneId(c);
      setLoadingListing(true);
      fetch(`/api/etsy/listing/${c}`)
        .then(res => res.json())
        .then(data => {
          const info = data.results && data.results.length > 0 ? data.results[0] : data;
          if (info && info.listing_id) {
            setListingInfo(info);
            handleGenerate(info);
          } else {
            console.warn("Invalid listing data received", data);
          }
        })
        .finally(() => setLoadingListing(false));
    }
  }, [searchParams]);

  const currentTask = activeJobId ? tasks[activeJobId] : null;

  const handleDownload = async () => {
    if (!currentTask?.result?.imageUrl) return;
    try {
      const res = await fetch(currentTask.result.imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentTask.result.title?.replace(/\s+/g, '_').toLowerCase() || 'design'}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">AI Studio</h1>
        <p className="text-zinc-500 mt-1 text-sm">Generate POD designs and listings using Gemini and Runware.</p>
      </div>
      
      {activeJobId && !currentTask && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-zinc-400 text-sm">Initializing AI Pipeline...</span>
        </div>
      )}

      {currentTask && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-white mb-4">Pipeline Status</h3>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={cn(
                    "text-[10px] font-semibold inline-block py-1 px-2 uppercase rounded-full tracking-wider border",
                    currentTask.progress === 100 ? "text-emerald-400 bg-emerald-400/10 border-emerald-500/20" : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                  )}>
                    {currentTask.progress === 100 ? "Complete" : "In Progress"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-zinc-500">
                    {currentTask.progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-zinc-800">
                <div style={{ width: `${currentTask.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
              </div>
              <p className="text-sm text-zinc-400 flex items-center gap-2">
                {currentTask.progress === 100 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
                {currentTask.message}
              </p>
            </div>
          </div>

          {currentTask.result && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 border-b md:border-b-0 md:border-r border-zinc-800 bg-[#0d0d0d] flex items-center justify-center">
                  <img src={currentTask.result.imageUrl} alt="Mockup" className="w-full h-auto rounded-lg object-cover border border-zinc-800/50" />
                </div>
                <div className="p-6 flex flex-col bg-zinc-900/50">
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{currentTask.result.title}</h3>
                  <p className="text-zinc-400 flex-1 text-sm">{currentTask.result.description}</p>
                  
                  {currentTask.result.tags && currentTask.result.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentTask.result.tags.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md border border-zinc-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors uppercase tracking-wider">
                      Send to Etsy Drafts
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-zinc-700 uppercase tracking-wider"
                    >
                      Download Design Asset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {loadingListing && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-zinc-400 text-sm">Analyzing listing to generate clone...</span>
        </div>
      )}
    </div>
  );
}

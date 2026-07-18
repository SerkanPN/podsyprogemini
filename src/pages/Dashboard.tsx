import { useEffect, useState } from 'react';
import { useSocketStore } from '../stores/useSocketStore';

export default function Dashboard() {
  const [stats, setStats] = useState({ healthScore: 0, activeTasks: 0, trendsFound: 0, totalListings: 0 });
  const tasks = useSocketStore(state => state.tasks);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        // Suppress network errors during hot reload or dev server restart
        console.warn('Could not fetch stats, server might be restarting...');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex-1 space-y-8 overflow-hidden">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1">Active AI Jobs</div>
          <div className="text-3xl font-bold text-white">{stats.activeTasks || 14}</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-indigo-500"></div>
            </div>
            <span className="text-[10px] text-indigo-400">68% Queue</span>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1">Market Opportunity</div>
          <div className="text-3xl font-bold text-white tracking-tight">🔥 HIGH</div>
          <div className="text-[10px] text-zinc-600 uppercase mt-2">Trend: Retro Floral (Etsy)</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1">Sync Health Score</div>
          <div className="text-3xl font-bold text-white">{stats.healthScore || 98}<span className="text-lg opacity-40">/100</span></div>
          <div className="text-[10px] text-emerald-500 uppercase mt-2">System Optimized</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1">New Drafts Ready</div>
          <div className="text-3xl font-bold text-white">124</div>
          <div className="text-[10px] text-zinc-600 uppercase mt-2">Awaiting Approval</div>
        </div>
      </div>

      {/* Split Layout Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[420px]">
        {/* Left: Queue Monitor */}
        <div className="col-span-1 lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 rounded-xl flex flex-col">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-white">Active Production Pipeline</h2>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">Real-time Socket.io</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-800/50">
                  <th className="px-6 py-3 font-normal">Job ID</th>
                  <th className="px-6 py-3 font-normal">Task Type</th>
                  <th className="px-6 py-3 font-normal">Status</th>
                  <th className="px-6 py-3 font-normal">Progress</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-zinc-800/30">
                  <td className="px-6 py-4 font-mono">#POD-9021</td>
                  <td className="px-6 py-4">Trend SEO & Metadata</td>
                  <td className="px-6 py-4 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Gemini AI Analyzing</td>
                  <td className="px-6 py-4">85%</td>
                </tr>
                <tr className="border-b border-zinc-800/30">
                  <td className="px-6 py-4 font-mono">#POD-9022</td>
                  <td className="px-6 py-4">Upscale (300DPI) + CMYK</td>
                  <td className="px-6 py-4 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Completed</td>
                  <td className="px-6 py-4">100%</td>
                </tr>
                <tr className="border-b border-zinc-800/30">
                  <td className="px-6 py-4 font-mono">#POD-9023</td>
                  <td className="px-6 py-4">Mockup Generation</td>
                  <td className="px-6 py-4 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span> Runware API Active</td>
                  <td className="px-6 py-4">42%</td>
                </tr>
                {Object.entries(tasks).map(([jobId, task]) => (
                  <tr key={jobId} className="border-b border-zinc-800/30">
                    <td className="px-6 py-4 font-mono">#{jobId}</td>
                    <td className="px-6 py-4">AI Studio Generation</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${task.progress === 100 ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
                      {task.message}
                    </td>
                    <td className="px-6 py-4">{task.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Assets/Studio Preview */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Latest AI Generations</h2>
          </div>
          <div className="p-4 flex-1 grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-lg aspect-square border border-zinc-700/50 p-2 flex flex-col">
               <div className="flex-1 bg-zinc-900 rounded mb-2 flex items-center justify-center text-zinc-700">Design 01</div>
               <div className="text-[10px] uppercase font-bold text-zinc-500">Floral Retro</div>
            </div>
            <div className="bg-zinc-800 rounded-lg aspect-square border border-zinc-700/50 p-2 flex flex-col">
               <div className="flex-1 bg-zinc-900 rounded mb-2 flex items-center justify-center text-zinc-700">Design 02</div>
               <div className="text-[10px] uppercase font-bold text-zinc-500">Typo Minimal</div>
            </div>
            <div className="bg-zinc-800 rounded-lg aspect-square border border-zinc-700/50 p-2 flex flex-col">
               <div className="flex-1 bg-zinc-900 rounded mb-2 flex items-center justify-center text-zinc-700">Mockup 01</div>
               <div className="text-[10px] uppercase font-bold text-zinc-500">T-Shirt V1</div>
            </div>
            <div className="bg-zinc-800 rounded-lg aspect-square border border-zinc-700/50 p-2 flex flex-col">
               <div className="flex-1 bg-zinc-900 rounded mb-2 flex items-center justify-center text-zinc-700">Mockup 02</div>
               <div className="text-[10px] uppercase font-bold text-zinc-500">Poster Wall</div>
            </div>
          </div>
          <button className="m-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors uppercase tracking-wider">
            Enter AI Studio
          </button>
        </div>
      </div>
    </div>
  );
}

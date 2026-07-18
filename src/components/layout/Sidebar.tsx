import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, Sparkles, FolderOpen, Clock, FileText, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#0f0f0f] flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
          P
        </div>
        <span className="text-lg font-semibold tracking-tight text-white uppercase">PodsyPro 2.0</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-500 uppercase px-2 mb-2 tracking-widest mt-2">Main Console</div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/listings"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <List className="w-5 h-5" />
          Etsy Listings
        </NavLink>
        <NavLink
          to="/following"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Bookmark className="w-5 h-5" />
          Following
        </NavLink>
        <NavLink
          to="/ai-studio"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Sparkles className="w-5 h-5" />
          AI Studio
        </NavLink>
        <NavLink
          to="/pod-assets"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <FolderOpen className="w-5 h-5" />
          POD Assets
        </NavLink>

        <div className="pt-8 text-xs font-semibold text-zinc-500 uppercase px-2 mb-2 tracking-widest">Automation</div>
        <div className="flex items-center gap-3 text-zinc-500 hover:text-zinc-300 px-3 py-2 rounded-md cursor-pointer transition-colors">
          <Clock className="w-5 h-5" />
          Cron Scheduler
        </div>
        <NavLink
          to="/reports"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <FileText className="w-5 h-5" />
          AI Reports
        </NavLink>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-zinc-500 uppercase">API Gateway</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 uppercase">Worker Node 01</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
      </div>
    </aside>
  );
}

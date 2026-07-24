import os

sidebar_content = """import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Key, 
  List, 
  Store, 
  ShoppingBag, 
  PlusCircle, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  User,
  Heart,
  Target,
  PieChart,
  Image,
  Lightbulb,
  Copy,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [aiStudioOpen, setAiStudioOpen] = useState(true);

  const renderLink = (to: string, icon: React.ReactNode, label: string) => {
    return (
      <NavLink
        to={to}
        title={isCollapsed ? label : undefined}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 relative group font-medium",
          isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
          isCollapsed ? "justify-center px-2" : ""
        )}
      >
        {icon}
        {!isCollapsed && <span className="text-sm truncate">{label}</span>}
        
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-950 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap border border-zinc-800 shadow-xl">
            {label}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <aside 
      className={cn(
        "border-r border-zinc-800 bg-[#111] flex flex-col hidden md:flex shrink-0 transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "p-4 flex items-center border-b border-zinc-800/50 h-20",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Categories</span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-md"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="px-2">
          {renderLink("/dashboard", <LayoutDashboard className="w-5 h-5" />, "Dashboard")}
        </div>

        {isCollapsed ? (
          <div className="px-2 space-y-2 border-t border-zinc-800/50 pt-4">
            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1">Profil</div>
            {renderLink("/profile", <User className="w-5 h-5 text-indigo-400" />, "Profil")}
            {renderLink("/my-favs", <Heart className="w-5 h-5 text-indigo-400" />, "My Favs")}
            {renderLink("/my-shop", <ShoppingBag className="w-5 h-5 text-indigo-400" />, "My Shop")}

            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1 mt-3">Analiz</div>
            {renderLink("/keyword-analysis", <Key className="w-5 h-5 text-amber-400" />, "Tag Analizi")}
            {renderLink("/trend-analysis", <TrendingUp className="w-5 h-5 text-amber-400" />, "Trend Analizi")}
            {renderLink("/listing-analysis", <List className="w-5 h-5 text-amber-400" />, "Listing Analizi")}
            {renderLink("/shop-analysis", <Store className="w-5 h-5 text-amber-400" />, "Shop Analizi")}
            {renderLink("/competitor-analysis", <Target className="w-5 h-5 text-amber-400" />, "Rakip Analizi")}
            {renderLink("/market-analysis", <PieChart className="w-5 h-5 text-amber-400" />, "Pazar Analizi")}

            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1 mt-3">AI Studio</div>
            {renderLink("/ai-studio/mockup", <Image className="w-5 h-5 text-emerald-400" />, "Mock-up Studio")}
            {renderLink("/ai-studio/idea", <Lightbulb className="w-5 h-5 text-emerald-400" />, "Idea Studio")}
            {renderLink("/ai-studio/clone", <Copy className="w-5 h-5 text-emerald-400" />, "Clone Studio")}
            {renderLink("/ai-studio/report", <FileText className="w-5 h-5 text-emerald-400" />, "Report Studio")}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Profil Kategorisi */}
            <div>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm">Profil Kategorisi</span>
                {profileOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {profileOpen && (
                <div className="mt-1 space-y-1 px-2 border-l border-zinc-800/80 ml-4 mr-2">
                  {renderLink("/profile", <User className="w-4 h-4" />, "Profil")}
                  {renderLink("/my-favs", <Heart className="w-4 h-4" />, "My Favs")}
                  {renderLink("/my-shop", <ShoppingBag className="w-4 h-4" />, "My Shop")}
                </div>
              )}
            </div>

            {/* Analiz Area */}
            <div>
              <button 
                onClick={() => setAnalyticsOpen(!analyticsOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm">Analiz Area</span>
                {analyticsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {analyticsOpen && (
                <div className="mt-1 space-y-1 px-2 border-l border-zinc-800/80 ml-4 mr-2">
                  {renderLink("/keyword-analysis", <Key className="w-4 h-4" />, "Tag Analizi")}
                  {renderLink("/trend-analysis", <TrendingUp className="w-4 h-4" />, "Trend Analizi")}
                  {renderLink("/listing-analysis", <List className="w-4 h-4" />, "Listing Analizi")}
                  {renderLink("/shop-analysis", <Store className="w-4 h-4" />, "Shop Analizi")}
                  {renderLink("/competitor-analysis", <Target className="w-4 h-4" />, "Rakip Analizi")}
                  {renderLink("/market-analysis", <PieChart className="w-4 h-4" />, "Pazar Analizi")}
                </div>
              )}
            </div>

            {/* PODSY AI STUDIO */}
            <div>
              <button 
                onClick={() => setAiStudioOpen(!aiStudioOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm">PODSY AI STUDIO</span>
                {aiStudioOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {aiStudioOpen && (
                <div className="mt-1 space-y-1 px-2 border-l border-zinc-800/80 ml-4 mr-2">
                  {renderLink("/ai-studio/mockup", <Image className="w-4 h-4" />, "Mock-up Studio")}
                  {renderLink("/ai-studio/idea", <Lightbulb className="w-4 h-4" />, "Idea Studio")}
                  {renderLink("/ai-studio/clone", <Copy className="w-4 h-4" />, "Clone Studio")}
                  {renderLink("/ai-studio/report", <FileText className="w-4 h-4" />, "Report Studio")}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
"""

with open("src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(sidebar_content)

print("Sidebar updated successfully.")

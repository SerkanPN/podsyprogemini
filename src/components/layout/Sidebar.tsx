import { NavLink } from 'react-router-dom';
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
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [takiplerOpen, setTakiplerOpen] = useState(true);

  // Helper to render links with tooltips when collapsed
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
        
        {/* Tooltip for collapsed state */}
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
      {/* Header Area */}
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

      {/* Navigation Area */}
      <nav className="flex-1 py-4 space-y-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Dashboard Link */}
        <div className="px-2">
          {renderLink("/", <LayoutDashboard className="w-5 h-5" />, "Dashboard")}
        </div>

        {isCollapsed ? (
          /* Collapsed direct list of all icons grouped for quick access */
          <div className="px-2 space-y-2 border-t border-zinc-800/50 pt-4">
            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1">Follow</div>
            {renderLink("/following/keywords", <Key className="w-5 h-5 text-indigo-400" />, "Following: Keywords")}
            {renderLink("/following/listings", <List className="w-5 h-5 text-indigo-400" />, "Following: Listings")}
            {renderLink("/following/shops", <Store className="w-5 h-5 text-indigo-400" />, "Following: Shops")}

            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1 mt-3">Tools</div>
            {renderLink("/ai-studio", <PlusCircle className="w-5 h-5 text-emerald-400" />, "Product Creation")}
            {renderLink("/listings", <List className="w-5 h-5 text-emerald-400" />, "Listing Analysis")}

            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1 mt-3">Analyt.</div>
            {renderLink("/reports", <TrendingUp className="w-5 h-5 text-amber-400" />, "Trend Analysis")}
            {renderLink("/keyword-analysis", <Key className="w-5 h-5 text-amber-400" />, "Keyword Analysis")}
            {renderLink("/shop-analytics", <Store className="w-5 h-5 text-amber-400" />, "Shop Analysis")}
            {renderLink("/my-shop", <ShoppingBag className="w-5 h-5 text-amber-400" />, "My Shop")}
          </div>
        ) : (
          /* Expanded Accordion Tree structure */
          <div className="space-y-4">
            {/* Tracked Items Section */}
            <div>
              <button 
                onClick={() => setTakiplerOpen(!takiplerOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm">Following</span>
                {takiplerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {takiplerOpen && (
                <div className="mt-1 space-y-1 px-2 border-l border-zinc-800/80 ml-4 mr-2">
                  {renderLink("/following/keywords", <Key className="w-4 h-4" />, "Keywords")}
                  {renderLink("/following/listings", <List className="w-4 h-4" />, "Listings")}
                  {renderLink("/following/shops", <Store className="w-4 h-4" />, "Shops")}
                </div>
              )}
            </div>

            {/* Tools Section */}
            <div>
              <button 
                onClick={() => setToolsOpen(!toolsOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm">Tools</span>
                {toolsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {toolsOpen && (
                <div className="mt-1 space-y-1 px-2 border-l border-zinc-800/80 ml-4 mr-2">
                  {renderLink("/ai-studio", <PlusCircle className="w-4 h-4" />, "Product Creation")}
                  {renderLink("/listings", <List className="w-4 h-4" />, "Listing Analysis")}
                </div>
              )}
            </div>

            {/* Analytics Section */}
            <div>
              <button 
                onClick={() => setAnalyticsOpen(!analyticsOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm">Analytics</span>
                {analyticsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {analyticsOpen && (
                <div className="mt-1 space-y-1 px-2 border-l border-zinc-800/80 ml-4 mr-2">
                  {renderLink("/reports", <TrendingUp className="w-4 h-4" />, "Trend Analysis")}
                  {renderLink("/keyword-analysis", <Key className="w-4 h-4" />, "Keyword Analysis")}
                  {renderLink("/shop-analytics", <Store className="w-4 h-4" />, "Shop Analysis")}
                  {renderLink("/my-shop", <ShoppingBag className="w-4 h-4" />, "My Shop")}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}

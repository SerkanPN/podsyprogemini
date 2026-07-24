import os

pages = {
    'Profile.tsx': '''export default function Profile() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <p>Full Name: Username</p>
        <p>Email: email@example.com</p>
        <p>Phone: +1 555 555 5555</p>
        <p>Shop Name: Podsy Store</p>
        <p>Membership Status: Premium</p>
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
    'TrendAnalysis.tsx': '''export default function TrendAnalysis() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Trend Analysis</h1></div>; }''',
    'ListingAnalysis.tsx': '''export default function ListingAnalysis() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Listing Analysis</h1>
      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Enter Listing ID or URL..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">Analyze</button>
      </div>
    </div>
  );
}''',
    'ShopAnalysis.tsx': '''export default function ShopAnalysis() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Shop Analysis</h1>
      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Enter Shop Name or URL..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">Analyze</button>
      </div>
    </div>
  );
}''',
    'CompetitorAnalysis.tsx': '''export default function CompetitorAnalysis() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Competitor Analysis</h1></div>; }''',
    'MarketAnalysis.tsx': '''export default function MarketAnalysis() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Market Analysis</h1></div>; }''',
    'MockupStudio.tsx': '''export default function MockupStudio() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Mock-up Studio</h1></div>; }''',
    'IdeaStudio.tsx': '''export default function IdeaStudio() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Idea Studio</h1></div>; }''',
    'CloneStudio.tsx': '''export default function CloneStudio() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Clone Studio</h1></div>; }''',
    'ReportStudio.tsx': '''export default function ReportStudio() { return <div className="p-6 text-white"><h1 className="text-2xl font-bold">Report Studio</h1></div>; }'''
}

for filename, content in pages.items():
    with open(f"src/pages/{filename}", "w", encoding="utf-8") as f:
        f.write(content)

sidebar_content = '''import { NavLink } from 'react-router-dom';
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
            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1">Profile</div>
            {renderLink("/profile", <User className="w-5 h-5 text-indigo-400" />, "Profile")}
            {renderLink("/my-favs", <Heart className="w-5 h-5 text-indigo-400" />, "My Favs")}
            {renderLink("/my-shop", <ShoppingBag className="w-5 h-5 text-indigo-400" />, "My Shop")}

            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1 mt-3">Analytics</div>
            {renderLink("/keyword-analysis", <Key className="w-5 h-5 text-amber-400" />, "Tag Analysis")}
            {renderLink("/trend-analysis", <TrendingUp className="w-5 h-5 text-amber-400" />, "Trend Analysis")}
            {renderLink("/listing-analysis", <List className="w-5 h-5 text-amber-400" />, "Listing Analysis")}
            {renderLink("/shop-analysis", <Store className="w-5 h-5 text-amber-400" />, "Shop Analysis")}
            {renderLink("/competitor-analysis", <Target className="w-5 h-5 text-amber-400" />, "Competitor Analysis")}
            {renderLink("/market-analysis", <PieChart className="w-5 h-5 text-amber-400" />, "Market Analysis")}

            <div className="text-[10px] font-bold text-zinc-600 text-center uppercase mb-1 mt-3">AI Studio</div>
            {renderLink("/ai-studio/mockup", <Image className="w-5 h-5 text-emerald-400" />, "Mock-up Studio")}
            {renderLink("/ai-studio/idea", <Lightbulb className="w-5 h-5 text-emerald-400" />, "Idea Studio")}
            {renderLink("/ai-studio/clone", <Copy className="w-5 h-5 text-emerald-400" />, "Clone Studio")}
            {renderLink("/ai-studio/report", <FileText className="w-5 h-5 text-emerald-400" />, "Report Studio")}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Profile Category */}
            <div>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm">Profile</span>
                {profileOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {profileOpen && (
                <div className="mt-1 space-y-1 px-2 border-l border-zinc-800/80 ml-4 mr-2">
                  {renderLink("/profile", <User className="w-4 h-4" />, "Profile")}
                  {renderLink("/my-favs", <Heart className="w-4 h-4" />, "My Favs")}
                  {renderLink("/my-shop", <ShoppingBag className="w-4 h-4" />, "My Shop")}
                </div>
              )}
            </div>

            {/* Analysis Area */}
            <div>
              <button 
                onClick={() => setAnalyticsOpen(!analyticsOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-sm">Analysis Area</span>
                {analyticsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {analyticsOpen && (
                <div className="mt-1 space-y-1 px-2 border-l border-zinc-800/80 ml-4 mr-2">
                  {renderLink("/keyword-analysis", <Key className="w-4 h-4" />, "Tag Analysis")}
                  {renderLink("/trend-analysis", <TrendingUp className="w-4 h-4" />, "Trend Analysis")}
                  {renderLink("/listing-analysis", <List className="w-4 h-4" />, "Listing Analysis")}
                  {renderLink("/shop-analysis", <Store className="w-4 h-4" />, "Shop Analysis")}
                  {renderLink("/competitor-analysis", <Target className="w-4 h-4" />, "Competitor Analysis")}
                  {renderLink("/market-analysis", <PieChart className="w-4 h-4" />, "Market Analysis")}
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
'''
with open("src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(sidebar_content)

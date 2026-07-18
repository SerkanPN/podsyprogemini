import { Search, Clock, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [query, setQuery] = useState('');
  const [showRecents, setShowRecents] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('omni_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) { }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecents(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const newRecents = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5);
      setRecentSearches(newRecents);
      localStorage.setItem('omni_recent_searches', JSON.stringify(newRecents));
      setShowRecents(false);
      navigate(`/listings?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const removeRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const newRecents = recentSearches.filter(s => s !== term);
    setRecentSearches(newRecents);
    localStorage.setItem('omni_recent_searches', JSON.stringify(newRecents));
  };

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0a0a0a] shrink-0">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block" ref={dropdownRef}>
          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-lg w-96 text-zinc-500 hover:border-zinc-700 transition-colors cursor-text focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowRecents(true)}
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder-zinc-500 text-zinc-200"
              placeholder="OmniSearch — Cmd+K to analyze listings"
            />
          </div>
          
          {/* Recent Searches Dropdown */}
          {showRecents && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-96 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Recent Searches</span>
                <button 
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('omni_recent_searches');
                  }}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider font-bold"
                >
                  Clear All
                </button>
              </div>
              <ul className="py-1">
                {recentSearches.map((term, i) => (
                  <li key={i} className="group">
                    <button
                      onClick={() => {
                        setQuery(term);
                        handleSearch(term);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-indigo-400 transition-colors flex items-center gap-3"
                    >
                      <Clock className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                      <span className="flex-1">{term}</span>
                      <div 
                        onClick={(e) => removeRecent(e, term)}
                        className="p-1 hover:bg-zinc-700 rounded opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-red-400"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex gap-2 items-center">
          <span className="text-xs text-zinc-500">Redis/Cache</span>
          <span className="text-xs font-mono text-emerald-400 px-1.5 py-0.5 bg-emerald-400/10 rounded">12ms</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-white">
          JD
        </div>
      </div>
    </header>
  );
}

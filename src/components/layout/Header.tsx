import { Search, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('etsy_access_token');
  });

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('etsy_access_token'));
    };
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth_status_changed', checkAuth);
    
    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && origin !== window.location.origin) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { code, state } = event.data;
        try {
          const response = await fetch('/api/auth/etsy/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              code, 
              state, 
              redirect_uri: `${window.location.origin}/auth/callback` 
            })
          });
          if (!response.ok) throw new Error('Token exchange failed');
          const data = await response.json();
          if (data.access_token) {
            localStorage.setItem('etsy_access_token', data.access_token);
            window.dispatchEvent(new Event('auth_status_changed'));
            window.dispatchEvent(new Event('storage'));
          }
        } catch (err) {
          console.error("Token exchange failed", err);
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth_status_changed', checkAuth);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const res = await fetch(`/api/auth/etsy/url?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}`);
      const { url } = await res.json();
      const width = 600, height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      window.open(url, 'EtsyLogin', `width=${width},height=${height},left=${left},top=${top}`);
    } catch (err) {
      console.error("Auth error", err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('etsy_access_token');
    window.dispatchEvent(new Event('auth_status_changed'));
    window.dispatchEvent(new Event('storage'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/keyword-analysis?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-20 border-b border-zinc-800 flex items-center justify-center bg-[#111111] shrink-0 px-4 md:px-8">
      <div className="max-w-7xl w-full flex items-center justify-between gap-6">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img src="/logo01.png" alt="PODSY PRO Logo" className="h-8 md:h-12 w-auto object-contain" />
          </Link>
        </div>

        <div className="flex-1 max-w-2xl hidden md:flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white text-zinc-900 border-none rounded-full h-10 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#F1641E] text-sm"
              placeholder="Search for anything"
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 w-8 rounded-full bg-[#F1641E] flex items-center justify-center hover:bg-[#D55515] transition-colors"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {isAuthenticated ? (
            <button 
              onClick={handleSignOut}
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 hidden sm:block px-3 py-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              Connected
            </button>
          ) : (
            <button 
              onClick={handleSignIn}
              className="text-sm font-semibold text-zinc-300 hover:text-white hidden sm:block px-3 py-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              Sign in
            </button>
          )}
          <button className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

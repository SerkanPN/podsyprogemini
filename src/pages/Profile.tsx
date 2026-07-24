import { User, Mail, Phone, Store, Crown, ShieldCheck, Camera, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In production, this uses the same domain. In dev, Vite proxies it.
    // If not proxied, we might need the full URL, but standard is /api
    fetch('/api/profile')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load profile data. Make sure backend is running and connected.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6 text-zinc-100">
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error || 'Profile not found.'}</p>
        </div>
      </div>
    );
  }

  const shop = profile.shops && profile.shops.length > 0 ? profile.shops[0] : null;
  const isConnected = !!shop;
  const userName = profile.name || profile.email.split('@')[0];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-zinc-100">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Hero / Banner Section */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <div className="h-32 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-zinc-900/50"></div>
        
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center overflow-hidden">
              <User className="w-10 h-10 text-zinc-400" />
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors opacity-0 group-hover:opacity-100 shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Title Info */}
          <div className="text-center sm:text-left flex-1 mb-2">
            <h2 className="text-xl font-bold text-white capitalize">{userName}</h2>
            <p className="text-sm text-zinc-400">{profile.email}</p>
          </div>

          {/* Status Badge */}
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium border border-amber-500/20">
              <Crown className="w-4 h-4" />
              Premium Member
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Personal Details */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-6">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Personal Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-zinc-800/50 rounded-lg text-indigo-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Full Name</p>
                <p className="text-sm font-medium text-zinc-200 capitalize">{userName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-zinc-800/50 rounded-lg text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Email Address</p>
                <p className="text-sm font-medium text-zinc-200">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-zinc-800/50 rounded-lg text-indigo-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Account Created</p>
                <p className="text-sm font-medium text-zinc-200">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Integration */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Shop Integration</h3>
            {isConnected ? (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                <ShieldCheck className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700">
                Not Connected
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            {isConnected ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-zinc-800/50 rounded-lg text-orange-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Connected Shop</p>
                    <p className="text-sm font-medium text-zinc-200">{shop.shopName}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                  <p className="text-xs text-indigo-300 leading-relaxed">
                    Your Etsy shop <strong>{shop.shopName}</strong> is successfully connected. We are actively syncing your listings (Total Sales: {shop.totalSales}).
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Store className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 mb-4">No Etsy shop connected.</p>
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors">
                  Connect Etsy Shop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-6">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Subscription Plan</h3>
          
          <div className="p-5 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-2">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-amber-500/80 mb-1">Current Plan</p>
              <p className="text-xl font-bold text-amber-500">Premium</p>
            </div>
            <p className="text-xs text-zinc-400">Renews on August 25, 2026</p>
          </div>

          <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">
            Manage Subscription
          </button>
        </div>

      </div>
    </div>
  );
}
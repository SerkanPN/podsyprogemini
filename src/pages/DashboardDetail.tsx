import React from 'react';
import { Sparkles, TrendingUp, Users, DollarSign, Package, Activity, ArrowRight, Bell, Settings } from 'lucide-react';

export default function DashboardDetail() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Satıcı Paneli
            <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-widest rounded-full font-bold">Aktif</div>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Mağazanızın genel durumunu ve AI önerilerini buradan takip edin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats (Placeholder data for now) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col hover:border-indigo-500/30 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Aylık Ziyaret</span>
            <Users className="w-4 h-4 text-indigo-400 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">4,281</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center mb-1">+12%</span>
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col hover:border-emerald-500/30 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Aylık Gelir</span>
            <DollarSign className="w-4 h-4 text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">$2,190</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center mb-1">+5%</span>
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col hover:border-amber-500/30 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Aktif İlan</span>
            <Package className="w-4 h-4 text-amber-400 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">42</span>
            <span className="text-xs font-semibold text-zinc-500 flex items-center mb-1">adet</span>
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col hover:border-[#F1641E]/30 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Dönüşüm</span>
            <Activity className="w-4 h-4 text-[#F1641E] opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">%2.4</span>
            <span className="text-xs font-semibold text-red-400 flex items-center mb-1">-0.3%</span>
          </div>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-[#121212] border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-inner">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Mağaza Asistanı</h2>
            <p className="text-[11px] text-zinc-400 font-medium">Otomatik fırsat tespiti</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-900/80 transition-colors cursor-pointer group flex items-start gap-3">
            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#F1641E] shadow-[0_0_8px_#F1641E]"></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">Kış Sezonu Başlıyor</p>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">"Winter", "Cozy", "Gift" etiketli ürünlerinizde %20 artış öngörülüyor. En çok satan 3 ilanınızı öne çıkarmanız önerilir.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#F1641E] transition-colors" />
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 hover:bg-zinc-900/80 transition-colors cursor-pointer group flex items-start gap-3">
            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">Rekabet Analizi: Başarılı</p>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">Fiyatlandırma stratejiniz rakiplerinizin %80'inden daha iyi dönüşüm getiriyor. Fiyatları değiştirmeyin.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>
        
        <button className="w-full mt-5 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
          Tüm Analiz Raporunu Gör
        </button>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pb-8">
        <button className="flex items-center justify-between p-4 bg-zinc-950/40 border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-colors group">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-zinc-400 group-hover:text-[#F1641E] transition-colors" />
            <span className="font-semibold text-sm text-zinc-300 group-hover:text-white transition-colors">Toplu Ürün Güncelleme</span>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
        </button>
      </div>

    </div>
  );
}

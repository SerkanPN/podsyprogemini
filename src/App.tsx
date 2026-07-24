import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSocketStore } from './stores/useSocketStore';
import { useAppStore } from './stores/useAppStore';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyFavs from './pages/MyFavs';
import ShopDetail from './pages/ShopDetail';

import KeywordAnalysis from './pages/KeywordAnalysis';
import TrendAnalysis from './pages/TrendAnalysis';
import ListingAnalysis from './pages/ListingAnalysis';
import ShopAnalysis from './pages/ShopAnalysis';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import MarketAnalysis from './pages/MarketAnalysis';

import MockupStudio from './pages/MockupStudio';
import IdeaStudio from './pages/IdeaStudio';
import CloneStudio from './pages/CloneStudio';
import ReportStudio from './pages/ReportStudio';

export default function App() {
  const { connect, disconnect } = useSocketStore();
  const theme = useAppStore(state => state.theme);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Profil Kategorisi */}
          <Route path="profile" element={<Profile />} />
          <Route path="my-favs" element={<MyFavs />} />
          <Route path="my-shop" element={<ShopDetail />} />

          {/* Analiz Area */}
          <Route path="keyword-analysis" element={<KeywordAnalysis />} />
          <Route path="trend-analysis" element={<TrendAnalysis />} />
          <Route path="listing-analysis" element={<ListingAnalysis />} />
          <Route path="shop-analysis" element={<ShopAnalysis />} />
          <Route path="competitor-analysis" element={<CompetitorAnalysis />} />
          <Route path="market-analysis" element={<MarketAnalysis />} />

          {/* PODSY AI STUDIO */}
          <Route path="ai-studio/mockup" element={<MockupStudio />} />
          <Route path="ai-studio/idea" element={<IdeaStudio />} />
          <Route path="ai-studio/clone" element={<CloneStudio />} />
          <Route path="ai-studio/report" element={<ReportStudio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

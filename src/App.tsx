import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSocketStore } from './stores/useSocketStore';
import { useAppStore } from './stores/useAppStore';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import ShopDetail from './pages/ShopDetail';
import AIStudio from './pages/AIStudio';
import Reports from './pages/Reports';
import PodAssets from './pages/PodAssets';
import Followed from './pages/Followed';

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
          <Route path="listings" element={<Listings />} />
          <Route path="listings/:id" element={<ListingDetail />} />
          <Route path="shops/:id" element={<ShopDetail />} />
          <Route path="following" element={<Followed />} />
          <Route path="ai-studio" element={<AIStudio />} />
          <Route path="reports" element={<Reports />} />
          <Route path="pod-assets" element={<PodAssets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

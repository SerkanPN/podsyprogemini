import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import ListingDetail from './pages/ListingDetail';
import ShopDetail from './pages/ShopDetail';
import './index.css';

function SidePanelApp() {
  const [currentMode, setCurrentMode] = useState<'listing' | 'shop' | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<any>(null);

  useEffect(() => {
    const updateFromActiveTab = async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0] && tabs[0].url) {
          const url = tabs[0].url;
          if (url.includes('etsy.com/listing')) {
            const match = url.match(/\/listing\/(\d+)/);
            if (match) {
              setCurrentMode('listing');
              setCurrentId(match[1]);
            }
          } else if (url.includes('etsy.com/shop')) {
            const match = url.match(/\/shop\/([^\/?]+)/);
            if (match) {
              setCurrentMode('shop');
              setCurrentId(match[1]);
            }
          } else {
            setCurrentMode(null);
            setCurrentId(null);
          }
        }
      } catch (e) {
        console.error("Tab query failed", e);
      }
    };

    updateFromActiveTab();

    // Listen to tab changes
    chrome.tabs.onActivated.addListener(updateFromActiveTab);
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.url || changeInfo.status === 'complete') {
        updateFromActiveTab();
      }
    });

    // Also read storage changes for scraped data
    chrome.storage.local.get(['scrapedListingData'], (res) => {
      if (res.scrapedListingData) setScrapedData(res.scrapedListingData);
    });

    const listener = (changes: any, area: string) => {
      if (area === 'local' && changes.scrapedListingData) {
        setScrapedData(changes.scrapedListingData.newValue);
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  if (!currentMode || !currentId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#121212] p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-[#F1641E]/20 rounded-full flex items-center justify-center">
          <span className="text-[#F1641E] font-bold text-xl">P</span>
        </div>
        <h2 className="text-zinc-300 font-bold">PodsyPro Analyzer</h2>
        <p className="text-xs text-zinc-500">
          Navigate to an Etsy Listing or Shop page and click the PodsyPro button to start analysis.
        </p>
      </div>
    );
  }

  // Provide scraped data to context or just render it above the actual ListingDetail for now
  return (
    <div className="h-screen w-full bg-[#121212] overflow-x-hidden">
      <MemoryRouter key={currentId} initialEntries={[`/${currentMode}/${currentId}`]}>
        <Routes>
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="*" element={<Navigate to={`/${currentMode}/${currentId}`} replace />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanelApp />);
}

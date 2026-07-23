// Allows users to open the side panel by clicking on the action toolbar icon
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ enabled: true, path: 'sidepanel.html' });
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

// Also set on startup just to be safe
chrome.runtime.onStartup.addListener(() => {
  chrome.sidePanel.setOptions({ enabled: true, path: 'sidepanel.html' });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_SIDEPANEL') {
    // Attempt to open the side panel on the active tab
    if (sender.tab && sender.tab.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id }).catch((e) => console.warn('Side panel open error:', e));
    }
  } else if (message.type === 'START_SALES_ANALYSIS') {
    handleSalesAnalysis(message.salesUrl, message.shopName)
      .then(results => sendResponse({ success: true, results }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
});

async function handleSalesAnalysis(baseSalesUrl: string, shopName: string) {
  // We'll scrape the first page to determine how many pages exist
  const firstPageUrl = `${baseSalesUrl}${baseSalesUrl.includes('?') ? '&' : '?'}ref=pagination&page=1`;
  const res = await fetch(firstPageUrl);
  if (!res.ok) throw new Error('Failed to fetch sales page');
  const html = await res.text();

  // Find max page using a regex for data-page="X" or href="...page=X"
  let maxPage = 1;
  const pageMatches = [...html.matchAll(/data-page="(\d+)"/g)];
  if (pageMatches.length > 0) {
    maxPage = Math.max(...pageMatches.map(m => parseInt(m[1], 10)));
  } else {
    // Fallback: look for ?page=X or &page=X in links
    const linkPageMatches = [...html.matchAll(/page=(\d+)/g)];
    if (linkPageMatches.length > 0) {
      maxPage = Math.max(...linkPageMatches.map(m => parseInt(m[1], 10)));
    }
  }

  // Cap at 100 pages to avoid extremely long runs or bans, unless user wants more.
  if (maxPage > 100) maxPage = 100;

  const listingCounts: Record<string, number> = {};

  // Extract from first page
  extractListingsFromHtml(html, listingCounts);

  // Fetch remaining pages
  for (let i = 2; i <= maxPage; i++) {
    // Artificial delay to prevent rate limiting (Etsy might block if too fast)
    await new Promise(resolve => setTimeout(resolve, 600)); 
    
    try {
      const pageUrl = `${baseSalesUrl}${baseSalesUrl.includes('?') ? '&' : '?'}ref=pagination&page=${i}`;
      const pageRes = await fetch(pageUrl);
      if (pageRes.ok) {
        const pageHtml = await pageRes.text();
        extractListingsFromHtml(pageHtml, listingCounts);
      }
    } catch (err) {
      console.warn(`Failed to fetch sales page ${i}`, err);
    }
  }

  // Convert to array and sort
  const sortedResults = Object.keys(listingCounts).map(id => ({
    listingId: id,
    salesCount: listingCounts[id]
  })).sort((a, b) => b.salesCount - a.salesCount);

  // Send the aggregated data to our backend for saving
  try {
    const token = await new Promise<string>((resolve) => {
      chrome.storage.local.get(['etsy_access_token'], (res) => resolve(res.etsy_access_token || ''));
    });
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Note: We use a relative or absolute URL to backend depending on where this is running.
    // For extension background, we need the absolute API URL.
    const apiUrl = 'http://localhost:3000/api/etsy/sync-extension-scrape';
    await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        shopName,
        type: 'sales_analysis',
        data: sortedResults,
        scrapedAt: Date.now()
      })
    });
  } catch (backendErr) {
    console.error('Failed to sync scraped data to backend', backendErr);
  }

  return sortedResults;
}

function extractListingsFromHtml(html: string, counts: Record<string, number>) {
  // Regex to find Etsy listing IDs in hrefs. Usually: href="https://www.etsy.com/listing/123456789/..."
  // Or relative: href="/listing/123456789/..."
  const regex = /href="[^"]*?\/listing\/(\d+)\/[^"]*?"/g;
  let match;
  // A set to avoid counting the same listing twice on the same page if it appears in multiple links (e.g. image link and title link)
  const foundOnPage = new Set<string>();
  
  while ((match = regex.exec(html)) !== null) {
    foundOnPage.add(match[1]);
  }

  // Add to global counts
  foundOnPage.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });
}

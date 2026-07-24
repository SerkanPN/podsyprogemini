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
  const listingCounts: Record<string, number> = {};
  let page = 1;
  let dynamicMaxPage = 1;

  while (page <= 250) { // Hard cap at 250 pages to avoid infinite loops (~9000-12000 sales)
    try {
      const pageUrl = `${baseSalesUrl}${baseSalesUrl.includes('?') ? '&' : '?'}ref=pagination&page=${page}`;
      const pageRes = await fetch(pageUrl);
      if (!pageRes.ok) break;
      
      const html = await pageRes.text();
      const newCount = extractListingsFromHtml(html, listingCounts);
      
      if (newCount === 0 && page > 1) {
        break; // Reached a page with no listings
      }

      // Dynamically check max page on every page load to push the limit further
      const pageMatches = [...html.matchAll(/data-page="(\d+)"/g)];
      const linkPageMatches = [...html.matchAll(/page=(\d+)/g)];
      const allPageNums = [...pageMatches, ...linkPageMatches].map(m => parseInt(m[1], 10)).filter(n => !isNaN(n));
      if (allPageNums.length > 0) {
        const foundMax = Math.max(...allPageNums);
        if (foundMax > dynamicMaxPage) {
          dynamicMaxPage = foundMax;
        }
      }

      // Stop if we've passed the maximum known page
      if (page >= dynamicMaxPage && page > 1) {
        break;
      }

    } catch (err) {
      console.warn(`Failed to fetch sales page ${page}`, err);
      break;
    }

    page++;
    // Artificial delay to prevent rate limiting (Etsy might block if too fast)
    await new Promise(resolve => setTimeout(resolve, 600)); 
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
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/etsy/sync-extension-scrape`;
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

  return foundOnPage.size;
}

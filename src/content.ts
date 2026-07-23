// PodsyPro Etsy Analyzer Content Script

function injectAnalyzerButton() {
  // Prevent duplicate injection
  if (document.getElementById('podsypro-analyzer-fab')) return;

  // Only inject on specific Etsy pages based on user instructions
  const url = window.location.href;
  const isListing = url.includes('etsy.com/listing');
  const isDashboard = url.includes('etsy.com/your/shops') && url.includes('dashboard');
  const isShop = url.includes('etsy.com/shop') && !isDashboard;

  if (!isListing && !isShop && !isDashboard) return;

  const btn = document.createElement('button');
  btn.id = 'podsypro-analyzer-fab';
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
    PodsyPro
  `;
  
  btn.style.position = 'fixed';
  btn.style.right = '20px';
  btn.style.top = '100px';
  btn.style.zIndex = '999999';
  btn.style.backgroundColor = '#F1641E';
  btn.style.color = '#FFFFFF';
  btn.style.border = 'none';
  btn.style.borderRadius = '30px';
  btn.style.padding = '12px 20px';
  btn.style.fontWeight = 'bold';
  btn.style.fontSize = '14px';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.transition = 'transform 0.2s';

  btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
  btn.onmouseout = () => btn.style.transform = 'scale(1)';

  btn.onclick = () => {
    // 1. Scrape real DOM data
    scrapeData();
    // 2. Open side panel
    chrome.runtime.sendMessage({ type: 'OPEN_SIDEPANEL' });
  };

  document.body.appendChild(btn);
}

function scrapeData() {
  const isListing = window.location.pathname.startsWith('/listing/');
  if (isListing) {
    // Extract hidden data not provided by API
    
    // Total Reviews String (e.g. "591 reviews")
    let totalReviewsMatch = document.body.innerText.match(/([0-9,]+)\s+reviews/i);
    let totalReviews = totalReviewsMatch ? parseInt(totalReviewsMatch[1].replace(/,/g, '')) : null;

    // Item Average (e.g. "4.9")
    let itemAvgMatch = document.body.innerText.match(/Item average.*?([0-9.]+)/i);
    let itemAvg = itemAvgMatch ? parseFloat(itemAvgMatch[1]) : null;
    
    const getPriceString = (): string | null => {
      const selects = Array.from(document.querySelectorAll('select[data-variation-number]')) as HTMLSelectElement[];
      for (const select of selects) {
        if (select.selectedIndex > 0) {
           const optionText = select.options[select.selectedIndex].textContent || '';
           const match = optionText.match(/\\([^0-9]*([0-9]+[.,][0-9]{2})[^)]*\\)/);
           if (match) return match[1];
        }
      }

      const selectors = [
        'div[data-buy-box-region="price"]',
        '.wt-text-title-03',
        '.wt-text-title-01',
        '.currency-value',
        '[data-buy-box-region="price"] p'
      ];
      
      for (let sel of selectors) {
        let elems = Array.from(document.querySelectorAll(sel));
        for (let el of elems) {
           if (el.closest('.wt-text-strikethrough') || el.classList.contains('wt-text-strikethrough')) continue;
           
           let clone = el.cloneNode(true) as HTMLElement;
           let strikes = clone.querySelectorAll('.wt-text-strikethrough, .wt-screen-reader-only, .wt-badge');
           strikes.forEach(s => s.remove());
           
           let text = clone.textContent || '';
           let match = text.match(/([0-9]+[.,][0-9]{2})/);
           if (match) return match[1];
        }
      }
      return null;
    };

    let priceStr = getPriceString();

    let originalPriceElement = document.querySelector('div[data-buy-box-region="price"] p.wt-text-strikethrough');
    let originalPriceStr = originalPriceElement ? originalPriceElement.textContent?.trim() : null;

    const url = window.location.href;
    const listingIdMatch = url.match(/\/listing\/(\d+)/);
    const listingId = listingIdMatch ? listingIdMatch[1] : null;

  try {
    if (listingId) {
      chrome.storage.local.set({
        scrapedListingData: {
          listingId,
          totalReviews,
          itemAverage: itemAvg,
          priceStr,
          originalPriceStr,
          scrapedAt: Date.now()
        },
        currentMode: 'listing',
        currentId: listingId
      });
    }
  } catch (e) {
    console.log('Extension context invalidated - please refresh the page');
  }
} else if (window.location.href.includes('etsy.com/your/shops') && window.location.href.includes('dashboard')) {
  // Is Dashboard
  try {
    chrome.storage.local.set({
      currentMode: 'dashboard',
      currentId: 'me'
    });
  } catch (e) {
    console.log('Extension context invalidated - please refresh the page');
  }
} else if (window.location.href.includes('etsy.com/shop')) {
    // Is Shop - robustly extract shop name ignoring query params
    const shopNameMatch = window.location.href.match(/\/shop\/([^/?#]+)/);
    const shopName = shopNameMatch ? shopNameMatch[1] : null;
    
    if (shopName) {
      try {
        chrome.storage.local.set({
          currentMode: 'shop',
          currentId: shopName
        });
      } catch (e) {
        console.log('Extension context invalidated - please refresh the page');
      }
    }
  }
}

let lastScrapedPriceStr: string | null = null;
let priceInterval: any = null;

function observePriceChanges() {
  const isListing = window.location.pathname.startsWith('/listing/');
  if (!isListing) return;

  if (priceInterval) clearInterval(priceInterval);

  priceInterval = setInterval(() => {
    const getPriceString = (): string | null => {
      const selects = Array.from(document.querySelectorAll('select[data-variation-number]')) as HTMLSelectElement[];
      for (const select of selects) {
        if (select.selectedIndex > 0) {
           const optionText = select.options[select.selectedIndex].textContent || '';
           const match = optionText.match(/\\([^0-9]*([0-9]+[.,][0-9]{2})[^)]*\\)/);
           if (match) return match[1];
        }
      }

      const selectors = [
        'div[data-buy-box-region="price"]',
        '.wt-text-title-03',
        '.wt-text-title-01',
        '.currency-value',
        '[data-buy-box-region="price"] p'
      ];
      
      for (let sel of selectors) {
        let elems = Array.from(document.querySelectorAll(sel));
        for (let el of elems) {
           if (el.closest('.wt-text-strikethrough') || el.classList.contains('wt-text-strikethrough')) continue;
           
           let clone = el.cloneNode(true) as HTMLElement;
           let strikes = clone.querySelectorAll('.wt-text-strikethrough, .wt-screen-reader-only, .wt-badge');
           strikes.forEach(s => s.remove());
           
           let text = clone.textContent || '';
           let match = text.match(/([0-9]+[.,][0-9]{2})/);
           if (match) return match[1];
        }
      }
      return null;
    };

    let priceStr = getPriceString();
    
    if (priceStr && priceStr !== lastScrapedPriceStr) {
      lastScrapedPriceStr = priceStr;
      // Re-scrape and update storage
      scrapeData();
    }
  }, 500); // Check every 500ms
}

// Also immediately listen to variation selects changing to act faster than 500ms
document.addEventListener('change', (e) => {
  const target = e.target as HTMLElement;
  if (target && target.tagName === 'SELECT' && target.classList.contains('wt-select__element')) {
    setTimeout(() => {
      scrapeData();
    }, 250); // small delay for DOM update
  }
});

let lastUrl = window.location.href;

// Observe DOM for SPA navigations on Etsy
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    // URL changed! Let's re-scrape data immediately so side panel updates
    setTimeout(() => {
      scrapeData();
      observePriceChanges();
    }, 1000); // Small delay to let React render the new page
  }
  
  injectAnalyzerButton();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial injection
injectAnalyzerButton();
observePriceChanges();

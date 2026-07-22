// Allows users to open the side panel by clicking on the action toolbar icon
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_SIDEPANEL') {
    // Attempt to open the side panel on the active tab
    if (sender.tab && sender.tab.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id });
    }
  }
});

const checkTab = async (tabId: number) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.url && tab.url.includes('etsy.com')) {
      await chrome.sidePanel.setOptions({ tabId, enabled: true });
    } else {
      await chrome.sidePanel.setOptions({ tabId, enabled: false });
    }
  } catch (e) {
    // Ignore errors
  }
};

chrome.tabs.onActivated.addListener((activeInfo) => {
  checkTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    checkTab(tabId);
  }
});

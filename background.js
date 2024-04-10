chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'activity') {
      const { userId, url } = message.data;
      
      // Send activity data to backend API
      fetch('http://localhost:3000/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, url })
      })
      .then(response => {
        console.log('Activity logged successfully');
      })
      .catch(error => {
        console.error('Error logging activity:', error);
      });
    }
  });
  // Background script
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, { action: 'tabUpdated', url: tab.url });
    }
  });
  
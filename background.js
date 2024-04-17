
  // Background script

  
// Generate UUID function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

// Event listener for extension installation or startup
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated');

      chrome.storage.local.get('extensionUserId', (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting data:', chrome.runtime.lastError);
            return;
        }

        if (!data.extensionUserId) {
            const userId = generateUUID();
            chrome.storage.local.set({ 'extensionUserId': userId }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error setting data:', chrome.runtime.lastError);
                    return;
                }
                console.log('User ID:', userId);
            });
        }
    });



});



  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, { action: 'tabUpdated', url: tab.url });
    }
  });
  
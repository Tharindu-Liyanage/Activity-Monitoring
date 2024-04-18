
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
  console.log('Extension installed');

  // Retrieve existing extensionUserId from local storage
  chrome.storage.local.get('extensionUserId', (data) => {
      if (chrome.runtime.lastError) {
          console.error('Error getting data:', chrome.runtime.lastError);
          return;
      }

      const existingUserId = data.extensionUserId;

      // If extensionUserId does not exist or is invalid, generate a new one
      if (!existingUserId) {
          const newUserId = generateUUID();

          // Check if the newUserId already exists in the Activity collection on the server
          checkUserIdExists(newUserId)
              .then((userIdExists) => {
                  if (userIdExists) {
                      // If the ID already exists, generate a new one recursively
                      return generateUniqueUserId();
                  } else {
                      // If the ID is unique, store it in local storage
                      chrome.storage.local.set({ 'extensionUserId': newUserId }, () => {
                          if (chrome.runtime.lastError) {
                              console.error('Error setting data:', chrome.runtime.lastError);
                          } else {
                              console.log('User ID generated and stored:', newUserId);
                          }
                      });
                  }
              })
              .catch((error) => {
                  console.error('Error checking user ID:', error);
              });
      }
  });
});


function checkUserIdExists(userId) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000/api/searchUserId?userId=${userId}`;
    
    console.log('Making request to:', url); // Log the URL being requested

    const headers = {
      'Access-Control-Allow-Origin': '*' // CORS header
    };

    const options = {
      method: 'GET',
      headers: headers
    };

    fetch(url, options)
      .then((response) => {
        console.log('Response status:', response.status); // Log the response status
        return response.json();
      })
      .then((data) => {
        console.log('Response data:', data); // Log the response data
        resolve(data.exists);
      })
      .catch((error) => {
        console.error('Fetch error:', error); // Log fetch error
        reject(error);
      });
  });
}





  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, { action: 'tabUpdated', url: tab.url });
    }
  });
  
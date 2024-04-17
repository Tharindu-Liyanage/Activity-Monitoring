chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'tabUpdated') {
    const { url } = message;
    const browser = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    let userIP;
    let userId;

    // Retrieve userId from chrome.storage.local
    chrome.storage.local.get('extensionUserId', (data) => {
      if (data.extensionUserId) {
        userId = data.extensionUserId;

        // Retrieve user IP and log activity
        getUserIP()
          .then(ip => {
            userIP = ip;
            return getLocation(userIP);
          })
          .then(locationInfo => {
            if (locationInfo) {
              const { country, region, city, loc } = locationInfo;
              const [latitude, longitude] = loc.split(',');

              // Send activity data to server with user, browser, and location information
              return fetch('http://localhost:3000/api/activity', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Set appropriate CORS headers for your environment
                  'Access-Control-Allow-Origin': '*' // Replace with actual origin
                },
                body: JSON.stringify({ userIP, userId, url, browser, screenWidth, screenHeight, country, region, city, latitude, longitude })
              });
            } else {
              throw new Error('Location information not available');
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Activity logged successfully:', data);
          })
          .catch(error => {
            console.error('Error logging activity:', error);
            // Consider more specific error handling (e.g., network errors, parsing errors)
          });
      } else {
        console.error('Extension User ID not found in storage');
      }
    });
  }
});

function getUserIP() {
  return new Promise((resolve, reject) => {
    fetch('https://api.ipify.org?format=json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user IP');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.ip) {
          resolve(data.ip);
        } else {
          reject(new Error('Invalid IP address response'));
        }
      })
      .catch(error => {
        reject(new Error('Error getting user IP:', error));
      });
  });
}

function getLocation(ip) {
  return new Promise((resolve, reject) => {
    fetch(`https://ipinfo.io/${ip}?token=02899d3765e97e`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch location information');
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(new Error('Error fetching location information:', error));
      });
  });
}

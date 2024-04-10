
/* // Content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'tabUpdated') {
      const { url } = message;
      const userId =  'user123'; // Replace with logic to get user ID
  
      // Send activity data to server
            fetch('http://localhost:3000/api/activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Allow requests from all origins (for testing)
        },
        body: JSON.stringify({ userId, url })
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
        });

    }
  });
*/


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'tabUpdated') {
      const { url } = message;
  
      // Replace with your actual logic to retrieve the user ID
      getUserId().then(userId => {
        // Send activity data to server
        fetch('http://localhost:3000/api/activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Set appropriate CORS headers for your environment
            'Access-Control-Allow-Origin': '*' // Replace with actual origin
          },
          body: JSON.stringify({ userId, url })
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
      })
      .catch(error => {
        console.error('Error getting user ID:', error);
      });
    }
  });
  
 
  
   function getUserId() {
    return new Promise((resolve, reject) => {
      const url = "https://api.ipify.org?format=json";
      const xhr = new XMLHttpRequest();
  
      xhr.open("GET", url);
      xhr.responseType = "json";
  
      xhr.onload = function () {
        if (xhr.status === 200) {
          const data = xhr.response;
          if (data && data.ip) {
            resolve(data.ip);
          } else {
            reject(new Error("Invalid IP address response"));
          }
        } else {
          reject(new Error(`Request failed with status: ${xhr.status}`));
        }
      };
  
      xhr.onerror = function (error) {
        reject(new Error("Network error occurred"));
      };
  
      xhr.send();
    });
  }
 
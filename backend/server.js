const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors module

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas (replace with your MongoDB URI)
mongoose.connect('mongodb+srv://tharinduprabashwara71:30cR6zXOzQNlfdPO@cluster20.xpnm4wu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster20', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




// Define Activity schema
const activitySchema = new mongoose.Schema({
  userIP: String,
  userId: String,
  url: String,
  browser: String,
  screenWidth: String,
  screenHeight: String,
  country: String,
  region: String,
  city: String,
  latitude: String,
  longitude: String,
  timestamp: { type: String, default: getISTDateTime() }
});

const Activity = mongoose.model('Activity', activitySchema);

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes


// API endpoint to receive activity data
app.post('/api/activity', async (req, res) => {
  try {
    const { userIP, userId, url, browser, screenWidth, screenHeight, country, region, city, latitude, longitude } = req.body;

    // Create new activity document
    const activity = new Activity({
      userIP,
      userId,
      url,
      browser,
      screenWidth,
      screenHeight,
      country,
      region,
      city,
      latitude,
      longitude
    });

    // Save activity to MongoDB
    await activity.save();

    res.status(201).json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to check if userId exists
app.get('/api/searchUserId', async (req, res) => {
  const { userId } = req.query;

  try {
    // Check if userId exists in the Activity collection
    const existingUser = await Activity.findOne({ userId });

    if (existingUser) {
      res.status(200).json({ exists: true, message: 'User ID exists in Activity collection' });
    } else {
      res.status(200).json({ exists: false, message: 'User ID does not exist in Activity collection' });
    }
  } catch (error) {
    console.error('Error checking user ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to get current time in IST
function getISTDateTime() {
  const date = new Date();
  const options = { timeZone: 'Asia/Colombo', hour12: false };
  return date.toLocaleString('en-IN', options);
}


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors module

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas (replace with your MongoDB URI)
mongoose.connect('mongodb+srv://tharinduprabashwara71:30cR6zXOzQNlfdPO@cluster20.xpnm4wu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster20', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Define Activity schema
const activitySchema = new mongoose.Schema({
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
  timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema);

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes


// API endpoint to receive activity data
app.post('/api/activity', async (req, res) => {
  try {
    const { userId, url, browser, screenWidth, screenHeight, country, region, city, latitude, longitude } = req.body;

    // Create new activity document
    const activity = new Activity({
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

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
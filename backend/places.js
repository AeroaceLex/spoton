const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { dateType, budget, area } = req.query;

  // Build a text query from filters
  let textQuery = 'dating spots in Singapore';
  if (dateType) textQuery = `${dateType} places in Singapore`;
  if (area) textQuery += ` ${area}`;

  try {
    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      { textQuery },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.photos,places.location'
        }
      }
    );

    res.json(response.data.places || []);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

module.exports = router;
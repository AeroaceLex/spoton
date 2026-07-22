const express = require('express');
const supabase = require('./supabaseClient');
const router = express.Router();

// Get all user-submitted places
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('places')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Submit a new place
router.post('/', async (req, res) => {
  const { name, description, address, location_area, date_type, budget, image_url, google_place_id, submitted_by } = req.body;

  const { data, error } = await supabase
    .from('places')
    .insert([{ name, description, address, location_area, date_type, budget, image_url, google_place_id, submitted_by }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;
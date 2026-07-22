const express = require('express');
const supabase = require('./supabaseClient');
const router = express.Router();

// Get ratings for a specific place
router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;

  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('place_id', placeId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Submit a new rating
router.post('/', async (req, res) => {
  const { place_id, user_id, rating, comment } = req.body;

  const { data, error } = await supabase
    .from('ratings')
    .insert([{ place_id, user_id, rating, comment }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const placesRouter = require('./places');
const ratingsRouter = require('./ratings');
const savedPlacesRouter = require('./savedPlaces'); 

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SpotOn backend is running');
});

app.use('/api/places', placesRouter);
app.use('/api/ratings', ratingsRouter);  
app.use('/api/saved-places', savedPlacesRouter); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
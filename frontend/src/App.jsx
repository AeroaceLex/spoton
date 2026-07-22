import { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './Auth';                  // ADD THIS
import { supabase } from './supabaseClient'; // ADD THIS
import './App.css';

function App() {
  const [dateType, setDateType] = useState('');
  const [area, setArea] = useState('');
  const [budget, setBudget] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);     // ADD THIS

  // ADD THIS BLOCK — checks if a user session already exists on page load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {   // ADD THIS
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/places`, {
        params: { dateType, area, budget }
      });
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SpotOn</h1>
      <p>Find the perfect date spot in Singapore</p>

      {/* ADD THIS BLOCK */}
      {user ? (
        <div style={{ marginBottom: '1rem' }}>
          <p>Logged in as {user.email}</p>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <Auth onLogin={setUser} />
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <select value={dateType} onChange={(e) => setDateType(e.target.value)}>
          <option value="">Date Type</option>
          <option value="romantic">Romantic</option>
          <option value="chill">Chill</option>
          <option value="adventure">Adventure</option>
          <option value="study">Study</option>
        </select>

        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Area</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="east">East</option>
          <option value="west">West</option>
          <option value="central">Central</option>
        </select>

        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="">Budget</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {places.map((place, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
            <h3>{place.displayName?.text}</h3>
            <p>{place.formattedAddress}</p>
            {place.rating && <p>⭐ {place.rating}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
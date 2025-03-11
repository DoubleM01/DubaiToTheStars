import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('http://localhost:8000/trips');
      setTrips(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Dubai to the Stars</h1>
      <p>Book your journey to space today!</p>
      <div className="trip-list">
        {trips.map((trip: any) => (
          <div key={trip.id} className="trip-item">
            <h2>{trip.name}</h2>
            <p>Schedule: {new Date(trip.schedule).toLocaleString()}</p>
            <p>Price: ${trip.price}</p>
            <button onClick={() => window.location.href=`/dashboard?tripId=${trip.id}`}>
              Book Now
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .container {
          padding: 20px;
          text-align: center;
        }
        .trip-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }
        .trip-item {
          background: #1a1a1a;
          color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
          transition: transform 0.3s ease;
        }
        .trip-item:hover {
          transform: scale(1.05);
        }
        button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Home;
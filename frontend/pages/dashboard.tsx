import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TravelTips from '../components/TravelTips';

const Dashboard = () => {
  const router = useRouter();
  const { tripId } = router.query;
  const [trip, setTrip] = useState<any>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      // For simplicity, reusing the trips endpoint and filtering client-side.
      const response = await axios.get('http://localhost:8000/trips');
      const foundTrip = response.data.find((t: any) => t.id === Number(tripId));
      setTrip(foundTrip);
      if(foundTrip){
        startCountdown(new Date(foundTrip.schedule));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startCountdown = (launchDate: Date) => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = launchDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Launched!");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
  };

  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>
      {trip ? (
        <div className="trip-details">
          <h2>{trip.name}</h2>
          <p>Launch Date: {new Date(trip.schedule).toLocaleString()}</p>
          <p>Countdown: {countdown}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <TravelTips />
      <style jsx>{`
        .dashboard {
          padding: 20px;
          text-align: center;
        }
        .trip-details {
          background: #1a1a1a;
          color: #fff;
          padding: 20px;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
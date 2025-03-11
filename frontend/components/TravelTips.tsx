import { useState, useEffect } from 'react';

const TravelTips = () => {
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    // In a real app, these tips might come from an AI service or API.
    setTips([
      "Pack light. You never know what the galaxy holds!",
      "Keep your spacesuit clean.",
      "Always double-check your travel itinerary!",
      "Explore local space cuisines."
    ]);
  }, []);

  return (
    <div className="tips">
      <h3>AI Travel Tips</h3>
      <ul>
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
      <style jsx>{`
        .tips {
          margin-top: 20px;
          padding: 15px;
          background: #f4f4f4;
          border-radius: 8px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        h3 {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default TravelTips;
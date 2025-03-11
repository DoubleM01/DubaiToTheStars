document.addEventListener("DOMContentLoaded", async () => {
  // Helper function to fetch JSON data from a given URL
  async function fetchData(url, method = "GET", body = null) {
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    return response.json();
  }

  // Load trips for the booking select
  async function loadTrips() {
    try {
      const trips = await fetchData("/api/trips");
      const tripSelect = document.getElementById("trip");
      trips.forEach(trip => {
        const option = document.createElement("option");
        option.value = trip.id;
        option.textContent = `${trip.destination} - ${new Date(trip.departure_time).toLocaleString()} - $${trip.price}`;
        tripSelect.appendChild(option);
      });
      // Also populate schedule cards
      const schedulesContainer = document.getElementById("schedules");
      trips.forEach(trip => {
        const card = document.createElement("div");
        card.className = "schedule-card";
        card.innerHTML = `
          <h3>${trip.destination}</h3>
          <p>Departure: ${new Date(trip.departure_time).toLocaleString()}</p>
          <p>Price: $${trip.price}</p>
          <p>Available Seats: ${trip.available_seats}</p>
        `;
        schedulesContainer.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading trips", err);
    }
  }

  // Booking form submission
  document.getElementById("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const tripId = document.getElementById("trip").value;
    const travelDate = document.getElementById("travelDate").value;
    const passengers = document.getElementById("passengers").value;
    
    try {
      const bookingResponse = await fetchData("/api/bookings", "POST", {
        trip_id: tripId,
        travel_date: travelDate,
        passengers: Number(passengers)
      });
      alert("Booking confirmed! Your booking reference: " + bookingResponse.booking_id);
      loadBookings(); // refresh dashboard bookings
    } catch (err) {
      console.error("Booking failed", err);
      alert("Failed to book trip. Please try again.");
    }
  });

  // Load user bookings to dashboard
  async function loadBookings() {
    try {
      const bookings = await fetchData("/api/bookings");
      const bookingsContainer = document.getElementById("userBookings");
      bookingsContainer.innerHTML = "";
      bookings.forEach(booking => {
        const li = document.createElement("li");
        li.textContent = `Booking ${booking.booking_id} for Trip ${booking.trip_id} on ${new Date(booking.travel_date).toLocaleDateString()}`;
        bookingsContainer.appendChild(li);
      });
    } catch(err) {
      console.error("Error loading bookings", err);
    }
  }

  // Simple countdown timer based on the next upcoming trip
  async function startCountdown() {
    try {
      const trips = await fetchData("/api/trips");
      // Find the next upcoming trip (for demo, pick the first one)
      if (trips.length === 0) return;
      const nextTrip = trips[0];
      const countdownEl = document.getElementById("countdown");
  
      const updateTimer = () => {
        const now = new Date();
        const departure = new Date(nextTrip.departure_time);
        const diff = departure - now;
  
        if(diff <= 0) {
          countdownEl.textContent = "Launched!";
          return;
        }
  
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
        countdownEl.textContent = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
      };
  
      updateTimer();
      setInterval(updateTimer, 1000);
    } catch(err) {
      console.error("Error initializing countdown", err);
    }
  }

  // Fake AI travel tips (in a real app, this might come from an AI service)
  function loadTravelTips() {
    const tips = [
      "Experience luxury like never before.",
      "Don’t forget to try our zero-g spa treatments.",
      "Capture your memories among the stars.",
      "Explore the cosmos with style and comfort."
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById("travelTips").textContent = tip;
  }
  
  // Initial load
  loadTrips();
  loadBookings();
  startCountdown();
  loadTravelTips();
});
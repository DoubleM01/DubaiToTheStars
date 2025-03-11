// Simulated API endpoints
const API_BASE = '/api';

// Sample AI-based travel tips array
const travelTips = [
  "Pack light but smart – space suits can be bulky!",
  "Don’t forget to hydrate; space travel can dehydrate you fast.",
  "Experience the beauty of the cosmos – look for constellations.",
  "Keep your travel documents in a secure, anti-gravity safe."
];

// Function to fetch trips data and populate schedule cards
async function loadTrips() {
  try {
    const response = await fetch(`${API_BASE}/trips`);
    const trips = await response.json();
    const scheduleContainer = document.querySelector('.schedule-cards');
    scheduleContainer.innerHTML = '';
    trips.forEach(trip => {
      const card = document.createElement('div');
      card.className = 'schedule-card';
      card.innerHTML = `
        <h3>${trip.destination} Trip</h3>
        <p>Date: ${trip.date}</p>
        <p>Price: ${trip.price}</p>
      `;
      scheduleContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching trips data', error);
  }
}

// Function to simulate countdown timer for the next trip
function startCountdown(endTime) {
  const timerElement = document.getElementById('timer');
  const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = endTime - now;
    if (distance < 0) {
      clearInterval(countdown);
      timerElement.innerHTML = "Trip Started!";
      return;
    }
    const days = Math.floor(distance/(1000*60*60*24));
    const hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
    const minutes = Math.floor((distance % (1000*60*60))/(1000*60));
    const seconds = Math.floor((distance % (1000*60))/1000);
    timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Function to display travel tips
function displayTravelTips() {
  const tipsList = document.getElementById('tips-list');
  travelTips.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });
}

// Event listener for booking form submission (simulate API post)
document.getElementById('booking-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const destination = document.getElementById('destination').value;
  const date = document.getElementById('date').value;
  const passengers = document.getElementById('passengers').value;
  const bookingData = { destination, date, passengers };

  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    const result = await response.json();
    alert(result.message || 'Booking confirmed!');
  } catch (error) {
    console.error('Error confirming booking', error);
    alert('There was an error processing your booking.');
  }
});

// Initialize the frontend
document.addEventListener('DOMContentLoaded', () => {
  loadTrips();
  displayTravelTips();

  // Set countdown to a fixed future date for demonstration (e.g., 7 days from now)
  let futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  startCountdown(futureDate.getTime());
});
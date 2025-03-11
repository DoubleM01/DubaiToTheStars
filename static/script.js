document.addEventListener('DOMContentLoaded', () => {
  // Fetch trip data, bookings, and schedules (simulated API calls)
  fetchData();
  initCountdown();
  displayTravelTips();
  
  // Booking form submission simulation
  document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Your booking has been confirmed! Safe travels beyond the stars.');
  });
});

function fetchData() {
  // Simulated fetch calls for trips, bookings, and pricing
  fetch('/api/trips')
    .then(response => response.json())
    .then(data => console.log('Trips:', data))
    .catch(err => console.error(err));

  fetch('/api/bookings')
    .then(response => response.json())
    .then(data => console.log('Bookings:', data))
    .catch(err => console.error(err));

  fetch('/api/pricing')
    .then(response => response.json())
    .then(data => console.log('Pricing:', data))
    .catch(err => console.error(err));
}

// Countdown Timer Logic (set to a sample future date)
function initCountdown() {
  // Set the countdown target date
  const countdownDate = new Date().getTime() + (10 * 24 * 60 * 60 * 1000); // 10 days from now

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update HTML
    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

    // If countdown is finished
    if (distance < 0) {
      clearInterval(timer);
      document.getElementById('countdown').innerText = "LAUNCHED";
    }
  }, 1000);
}

// Display AI-based travel tips (using a basic array)
function displayTravelTips() {
  const tips = [
    "Travel light but bring your adventurous spirit.",
    "Embrace the futuristic vibe and enjoy every moment.",
    "Remember to capture the beauty of space and Dubai's elegance.",
    "Stay curious and explore new horizons."
  ];
  
  const tipsList = document.getElementById('tips-list');
  tips.forEach(tip => {
    const li = document.createElement('li');
    li.innerText = tip;
    tipsList.appendChild(li);
  });
}
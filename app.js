// app.js
document.addEventListener("DOMContentLoaded", function () {
  const bookingForm = document.getElementById("booking-form");
  const availabilityDiv = document.getElementById("availability");

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Normally this would call the backend API for availability
    const tripDate = document.getElementById("trip-date").value;
    const destination = document.getElementById("destination").value;

    // Mock availability check
    availabilityDiv.innerHTML = `<p>Checking availability for ${destination} on ${tripDate}...</p>`;

    // Simulate real time response
    setTimeout(() => {
      availabilityDiv.innerHTML = `<p>Space trip available! <button>Book Now</button></p>`;
    }, 1000);
  });

  // Launch countdown timer simulation
  const launchTimer = document.getElementById("launch-timer");
  function updateCountdown() {
    // For demo, use a fixed countdown (e.g., 1 hour from now)
    let endTime = new Date().getTime() + 3600 * 1000;
    let now = new Date().getTime();
    let distance = endTime - now;
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    launchTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  setInterval(updateCountdown, 1000);

  // Simulate AI-based travel tips update
  const travelTipsContent = document.getElementById("travel-tips-content");
  setTimeout(() => {
    travelTipsContent.textContent =
      "Remember to pack your space suit and enjoy zero-gravity experiences!";
  }, 1500);

  // Simulate user bookings load
  const bookingsList = document.getElementById("bookings-list");
  setTimeout(() => {
    let bookings = ["Trip to ISS - 2025-04-15", "Moon Base Visit - 2025-05-22"];
    bookingsList.innerHTML = bookings
      .map((booking) => `<li>${booking}</li>`)
      .join("");
  }, 2000);
});
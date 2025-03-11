// app.js
document.addEventListener("DOMContentLoaded", function () {
  const bookingForm = document.getElementById("booking-form");
  const availabilityDiv = document.getElementById("availability");

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const tripDate = document.getElementById("trip-date").value;
    const destination = document.getElementById("destination").value;

    // Simulate a real-time check for availability
    availabilityDiv.innerHTML = `<p>Checking availability for ${destination} on ${tripDate}...</p>`;

    setTimeout(() => {
      availabilityDiv.innerHTML = `<p>Space trip available! <button>Book Now</button></p>`;
    }, 1000);
  });

  // Launch countdown timer simulation
  const launchTimer = document.getElementById("launch-timer");
  function updateCountdown() {
    let endTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
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

  // Simulate loading AI-based travel tips
  const travelTipsContent = document.getElementById("travel-tips-content");
  setTimeout(() => {
    travelTipsContent.textContent = "Remember to pack your space suit and enjoy the zero-gravity experience!";
  }, 1500);

  // Simulate loading user bookings
  const bookingsList = document.getElementById("bookings-list");
  setTimeout(() => {
    let bookings = ["Trip to ISS - 2025-04-15", "Moon Base Visit - 2025-05-22"];
    bookingsList.innerHTML = bookings.map((booking) => `<li>${booking}</li>`).join("");
  }, 2000);
});
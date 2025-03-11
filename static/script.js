document.addEventListener("DOMContentLoaded", () => {
  // Populate departure dates and package options
  populateDepartureDates();
  populatePackages();
  populateSchedule();
  displayTravelTips();

  // Booking form submission
  document
    .getElementById("booking-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      handleBooking();
    });
});

// Fetch available trips to populate departure date options.
function populateDepartureDates() {
  fetch("/api/trips")
    .then((response) => response.json())
    .then((data) => {
      const departureSelect = document.getElementById("departure-date");
      // Clear current options except the default one.
      departureSelect.innerHTML =
        '<option value="">Select a departure date</option>';
      data.trips.forEach((trip) => {
        const option = document.createElement("option");
        option.value = trip.departure;
        option.innerText = `${trip.destination} - ${trip.departure}`;
        departureSelect.appendChild(option);
      });
    })
    .catch((err) => console.error(err));
}

// Populate package options
function populatePackages() {
  // Fixed packages list matching the pricing endpoint
  const packages = [
    { id: "luxury_cabin", name: "Luxury Cabins" },
    { id: "economy_shuttle", name: "Economy Shuttles" },
    { id: "vip_zero_gravity", name: "VIP Zero-Gravity Experiences" },
  ];

  const packageSelect = document.getElementById("package-select");
  // Clear current options except the default one.
  packageSelect.innerHTML =
    '<option value="">Select a package</option>';

  packages.forEach((pack) => {
    const option = document.createElement("option");
    option.value = pack.id;
    option.innerText = pack.name;
    packageSelect.appendChild(option);
  });
}

// Populate schedule section with available trips.
function populateSchedule() {
  fetch("/api/trips")
    .then((response) => response.json())
    .then((data) => {
      const scheduleCards = document.getElementById("schedule-cards");
      scheduleCards.innerHTML = "";
      data.trips.forEach((trip) => {
        const card = document.createElement("div");
        card.className = "schedule-card";
        card.innerHTML = `
          <h3>${trip.destination}</h3>
          <p>Departure: ${trip.departure}</p>
          <p>Duration: ${trip.duration}</p>
        `;
        scheduleCards.appendChild(card);
      });
    })
    .catch((err) => console.error(err));
}

// Display AI-based travel tips (using a basic array)
function displayTravelTips() {
  const tips = [
    "Travel light but bring your adventurous spirit.",
    "Embrace the futuristic vibe and enjoy every moment.",
    "Remember to capture the beauty of space and Dubai's elegance.",
    "Stay curious and explore new horizons.",
  ];

  const tipsList = document.getElementById("tips-list");
  tipsList.innerHTML = "";
  tips.forEach((tip) => {
    const li = document.createElement("li");
    li.innerText = tip;
    tipsList.appendChild(li);
  });
}

// Handle the booking process: update countdown timer and generate a PDF ticket.
function handleBooking() {
  const userName = document.getElementById("user-name").value;
  const departureDate = document.getElementById("departure-date").value;
  const selectedPackage = document.getElementById("package-select").value;

  if (!userName || !departureDate || !selectedPackage) {
    alert("Please fill out all booking fields.");
    return;
  }

  alert("Your booking has been confirmed! Safe travels beyond the stars.");

  // Update countdown timer with the selected departure date.
  startCountdown(new Date(departureDate));

  // Generate PDF boarding pass ticket.
  generateTicketPDF(userName, departureDate, selectedPackage);
}

// Starts the countdown timer based on the provided target date.
function startCountdown(targetDate) {
  // Clear any existing timer intervals.
  if (window.countdownTimer) {
    clearInterval(window.countdownTimer);
  }
  window.countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText =
      hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText =
      minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText =
      seconds < 10 ? "0" + seconds : seconds;

    if (distance < 0) {
      clearInterval(window.countdownTimer);
      document.getElementById("countdown").innerText = "DEPARTED";
    }
  }, 1000);
}

// Generate a PDF ticket that resembles an air travel boarding pass.
function generateTicketPDF(userName, departureDate, selectedPackage) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape" });

  // Styling for boarding pass feel
  doc.setFillColor(20, 20, 20);
  doc.rect(10, 10, 280, 80, "F");

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(28);
  doc.text("BOARDING PASS", 20, 30);

  doc.setFontSize(16);
  doc.text(`Passenger: ${userName}`, 20, 45);
  doc.text(`Departure: ${departureDate}`, 20, 60);

  // Format package name for display.
  let packageName = "";
  switch (selectedPackage) {
    case "luxury_cabin":
      packageName = "Luxury Cabins";
      break;
    case "economy_shuttle":
      packageName = "Economy Shuttles";
      break;
    case "vip_zero_gravity":
      packageName = "VIP Zero-Gravity Experiences";
      break;
    default:
      packageName = selectedPackage;
  }
  doc.text(`Package: ${packageName}`, 20, 75);

  // Add design lines for style
  doc.setDrawColor(212, 175, 55);
  doc.line(150, 10, 150, 90);

  // Add additional flight details on the right side
  doc.setFontSize(14);
  doc.text("Dubai to the Stars", 160, 30);
  doc.text("Gate: A12", 160, 45);
  doc.text("Seat: 21B", 160, 60);
  doc.text("Boarding Time: 07:45", 160, 75);

  // Open the PDF in a new window
  doc.output("dataurlnewwindow");
}

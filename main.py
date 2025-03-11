from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import List
import json
import uuid
import os

app = FastAPI(title="Dubai to the Stars API")

# Enable CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static directory to serve the frontend files (HTML, CSS, JS)
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# File paths for simulated database
TRIPS_FILE = "trips.json"
BOOKINGS_FILE = "bookings.json"
ACCOMMODATIONS_FILE = "accommodations.json"

# Data Models
class Trip(BaseModel):
    id: int
    destination: str
    departure_time: str  # ISO formatted datetime string
    price: float
    available_seats: int

class Booking(BaseModel):
    booking_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_id: int
    travel_date: str  # ISO formatted date string
    passengers: int

# Utility functions to read/write JSON files
def read_json(filename):
    if not os.path.exists(filename):
        return []
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

# API Endpoints

@app.get("/api/trips", response_model=List[Trip])
def get_trips():
    trips = read_json(TRIPS_FILE)
    return trips

@app.get("/api/bookings", response_model=List[Booking])
def get_bookings():
    bookings = read_json(BOOKINGS_FILE)
    return bookings

@app.post("/api/bookings", response_model=Booking)
def create_booking(booking: Booking):
    trips = read_json(TRIPS_FILE)
    # Validate trip exists and seats are available
    selected_trip = next((trip for trip in trips if trip["id"] == booking.trip_id), None)
    if not selected_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if booking.passengers > selected_trip["available_seats"]:
        raise HTTPException(status_code=400, detail="Not enough available seats")
    
    # Deduct booked seats from the trip's available seats
    selected_trip["available_seats"] -= booking.passengers
    # Save updated trips data
    write_json(TRIPS_FILE, trips)

    # Append the booking to bookings file
    bookings = read_json(BOOKINGS_FILE)
    bookings.append(booking.dict())
    write_json(BOOKINGS_FILE, bookings)

    return booking

@app.get("/api/pricing")
def get_pricing():
    trips = read_json(TRIPS_FILE)
    pricing_info = [{"trip_id": trip["id"], "destination": trip["destination"], "price": trip["price"]} for trip in trips]
    return pricing_info

# Optional endpoint: accommodations (if needed for dynamic recommendations)
@app.get("/api/accommodations")
def get_accommodations():
    accommodations = read_json(ACCOMMODATIONS_FILE)
    return accommodations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
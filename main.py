import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import List, Optional

app = FastAPI(title="Dubai to the Stars API")

# Enable CORS for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static directory to serve HTML, CSS, and JS files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# Pydantic models for request/response
class Trip(BaseModel):
    id: int
    destination: str
    trip_date: str
    available_seats: int
    price: float

class Booking(BaseModel):
    id: Optional[int]
    trip_id: int
    user_id: int
    status: str = Field(default="Pending")

class Accommodation(BaseModel):
    id: int
    name: str
    description: str
    price_per_night: float

# Simulated in-memory database
trips_db = [
    Trip(id=1, destination="International Space Station", trip_date="2025-04-15", available_seats=10, price=500000.0),
    Trip(id=2, destination="Moon Base", trip_date="2025-05-22", available_seats=5, price=750000.0),
    Trip(id=3, destination="Mars Colony", trip_date="2025-06-10", available_seats=3, price=1000000.0),
]

bookings_db = []  # List to store bookings

@app.get("/api/trips", response_model=List[Trip])
async def get_trips():
    return trips_db

@app.get("/api/trip/{trip_id}", response_model=Trip)
async def get_trip(trip_id: int):
    trip = next((t for t in trips_db if t.id == trip_id), None)
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@app.post("/api/bookings", response_model=Booking)
async def create_booking(booking: Booking):
    trip = next((t for t in trips_db if t.id == booking.trip_id), None)
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.available_seats <= 0:
        raise HTTPException(status_code=400, detail="No available seats")
    trip.available_seats -= 1
    booking.id = len(bookings_db) + 1
    bookings_db.append(booking)
    return booking

@app.get("/api/bookings", response_model=List[Booking])
async def get_bookings():
    return bookings_db

@app.get("/api/pricing", response_model=List[Trip])
async def get_pricing():
    return trips_db

@app.get("/api/schedules", response_model=List[Trip])
async def get_schedules():
    return trips_db

@app.get("/api/accommodations", response_model=List[Accommodation])
async def get_accommodations():
    accommodations = [
        Accommodation(id=1, name="Orbital Suite", description="Luxury suite with Earth view", price_per_night=20000.0),
        Accommodation(id=2, name="Zero Gravity Pod", description="Experience true weightlessness", price_per_night=15000.0),
    ]
    return accommodations

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
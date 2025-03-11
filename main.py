from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import uvicorn
import os

app = FastAPI(title="Dubai to the Stars API")

# Mount static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Enable CORS if needed for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models
class Trip(BaseModel):
    id: int
    destination: str
    date: str
    price: str

class Booking(BaseModel):
    id: Optional[int] = None
    destination: str
    date: str
    passengers: int

class Accommodation(BaseModel):
    id: int
    name: str
    location: str
    price: str

# File paths for persistence
TRIPS_FILE = "trips.json"
BOOKINGS_FILE = "bookings.json"
ACCOMMODATIONS_FILE = "accommodations.json"

# Helper functions to load and save JSON data
def load_data(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r") as f:
        return json.load(f)

def save_data(file_path, data):
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

# API Endpoints

@app.get("/api/trips", response_model=List[Trip])
def get_trips():
    trips = load_data(TRIPS_FILE)
    return trips

@app.post("/api/bookings")
def create_booking(booking: Booking):
    bookings = load_data(BOOKINGS_FILE)
    new_id = bookings[-1]["id"] + 1 if bookings else 1
    booking.id = new_id
    bookings.append(booking.dict())
    save_data(BOOKINGS_FILE, bookings)
    return {"message": "Booking confirmed!", "booking": booking.dict()}

@app.get("/api/pricing")
def get_pricing():
    # Static pricing data for demonstration
    pricing_data = {
        "moon": "$250,000",
        "mars": "$500,000",
        "jupiter": "$750,000"
    }
    return pricing_data

@app.get("/api/accommodations", response_model=List[Accommodation])
def get_accommodations():
    accommodations = load_data(ACCOMMODATIONS_FILE)
    return accommodations

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
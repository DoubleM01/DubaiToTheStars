from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

app = FastAPI(title="Dubai to the Stars API")

# Allow CORS for local development/testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the "static" directory to serve frontend files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

def load_json(filename: str):
    file_path = Path(filename)
    if not file_path.exists():
        return {}
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/trips")
def get_trips():
    trips = load_json("trips.json")
    if not trips:
        raise HTTPException(status_code=404, detail="Trips data not found")
    return trips

@app.get("/api/bookings")
def get_bookings():
    bookings = load_json("bookings.json")
    if not bookings:
        # Return empty list if no bookings exist yet
        return []
    return bookings

@app.get("/api/pricing")
def get_pricing():
    # Sample pricing and package details
    pricing = {
        "luxury_cabin": {
            "price": 5000,
            "description": "Premium comfort with exclusive services."
        },
        "economy_shuttle": {
            "price": 1500,
            "description": "Affordable travel with all essential amenities."
        },
        "vip_zero_gravity": {
            "price": 10000,
            "description": "Exclusive zero-gravity experience with personalized service."
        }
    }
    return pricing

@app.get("/api/accommodations")
def get_accommodations():
    accommodations = load_json("accommodations.json")
    if not accommodations:
        raise HTTPException(status_code=404, detail="Accommodations data not found")
    return accommodations

# For real-time update simulation (e.g., countdown timer, schedule updates)
@app.get("/api/updates")
def get_updates():
    # This endpoint could be enhanced to push real time updates. For now, it returns a simple message.
    return {"message": "Real-time updates will be provided here."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
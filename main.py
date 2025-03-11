from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uvicorn

from database import engine, get_db
import models, schemas

app = FastAPI(title="Dubai to the Stars Booking Platform")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # Creating tables on startup; in a production app you would use Alembic migrations.
        await conn.run_sync(models.Base.metadata.create_all)

@app.get("/trips", response_model=list[schemas.Trip])
async def get_trips(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Trip).offset(skip).limit(limit))
    trips = result.scalars().all()
    return trips

@app.post("/trips", response_model=schemas.Trip)
async def create_trip(trip: schemas.TripCreate, db: AsyncSession = Depends(get_db)):
    db_trip = models.Trip(**trip.dict())
    db.add(db_trip)
    await db.commit()
    await db.refresh(db_trip)
    return db_trip

@app.post("/bookings", response_model=schemas.Booking)
async def create_booking(booking: schemas.BookingCreate, db: AsyncSession = Depends(get_db)):
    # Check trip availability
    query = select(models.Trip).where(models.Trip.id == booking.trip_id)
    result = await db.execute(query)
    trip = result.scalar()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.available_seats <= 0:
        raise HTTPException(status_code=400, detail="No available seats")
    # Update the available seats
    trip.available_seats -= 1
    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)
    await db.commit()
    await db.refresh(db_booking)
    return db_booking

@app.get("/accommodations", response_model=list[schemas.Accommodation])
async def get_accommodations(trip_id: int, db: AsyncSession = Depends(get_db)):
    query = select(models.Accommodation).where(models.Accommodation.trip_id == trip_id)
    result = await db.execute(query)
    accommodations = result.scalars().all()
    return accommodations

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
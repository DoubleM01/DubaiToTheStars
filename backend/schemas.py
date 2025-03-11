from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class TripBase(BaseModel):
    name: str
    schedule: datetime
    price: Decimal
    capacity: int
    available_seats: int

class TripCreate(TripBase):
    pass

class Trip(TripBase):
    id: int
    class Config:
        orm_mode = True

class BookingBase(BaseModel):
    user_id: int
    trip_id: int
    status: str

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    booked_at: datetime
    class Config:
        orm_mode = True

class AccommodationBase(BaseModel):
    trip_id: int
    type: str
    price: Decimal

class AccommodationCreate(AccommodationBase):
    pass

class Accommodation(AccommodationBase):
    id: int
    class Config:
        orm_mode = True
from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Trip(Base):
    __tablename__ = 'trips'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    schedule = Column(DateTime, nullable=False)
    price = Column(Numeric, nullable=False)
    capacity = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)

class Booking(Base):
    __tablename__ = 'bookings'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    trip_id = Column(Integer, ForeignKey('trips.id'), nullable=False)
    booked_at = Column(DateTime, server_default=func.now())
    status = Column(String, default="confirmed", nullable=False)

class Accommodation(Base):
    __tablename__ = 'accommodations'
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey('trips.id'), nullable=False)
    type = Column(String, nullable=False)
    price = Column(Numeric, nullable=False)
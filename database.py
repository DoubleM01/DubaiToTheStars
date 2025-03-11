from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Update with your actual DB credentials
DATABASE_URL = "postgresql://test_xzio_user:izxgtvCyWZOUt6fIg0FYyln3wLCzbGOd@dpg-cv7sin9c1ekc73d1rufg-a/test_xzio"

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with async_session() as session:
        yield session

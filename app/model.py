from typing import Optional

from pydantic import BaseModel


class PoiCreate(BaseModel):
    name: str
    elevation: float
    count: int
    longitude: float
    latitude: float


class PoiUpdate(BaseModel):
    name: Optional[str] = None
    elevation: Optional[float] = None
    count: Optional[int] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None

from typing import Optional

from pydantic import BaseModel


class PoiCreate(BaseModel):
    longitude: float
    latitude: float
    name: str
    elevation: float
    count: int


class PoiUpdate(BaseModel):
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    name: Optional[str] = None
    elevation: Optional[float] = None
    count: Optional[int] = None

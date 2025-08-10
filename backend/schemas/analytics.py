from typing import Annotated
from pydantic import BaseModel, Field
from decimal import Decimal

class CategoriaTotal(BaseModel):
    categoria: str
    total: Annotated[Decimal, Field(max_digits=12, decimal_places=2)]

class AnalyticsSummaryResponse(BaseModel):
    ingresos: list[CategoriaTotal]
    egresos: list[CategoriaTotal]
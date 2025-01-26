from fastapi import APIRouter, HTTPException
from typing import List, Dict

router = APIRouter()

# Sample data - replace with database in production
items: List[Dict] = []

@router.get("/api/items")
async def get_items():
    return items

@router.post("/api/items")
async def create_item(item: dict):
    items.append(item)
    return item

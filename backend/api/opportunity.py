from typing import Optional
from fastapi import APIRouter

from db.supabase_client import supabase

router = APIRouter()


@router.get("/")
def get_opportunities(
    category: Optional[str] = None,
    country: Optional[str] = None,
    women_friendly: Optional[bool] = None,
    student_eligible: Optional[bool] = None,
    indian_eligible: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
):
    query = supabase.table("opportunities").select("*")

    if category:
        query = query.eq("category", category)
    if country:
        query = query.eq("country", country)
    if women_friendly is not None:
        query = query.eq("women_friendly", women_friendly)
    if student_eligible is not None:
        query = query.eq("student_eligible", student_eligible)
    if indian_eligible is not None:
        query = query.eq("indian_eligible", indian_eligible)

    query = query.range(offset, offset + limit - 1)
    response = query.execute()
    return response.data


@router.get("/stats")
def get_stats():
    """Return aggregate counts for the dashboard."""
    all_data = supabase.table("opportunities").select("category, country, women_friendly, student_eligible").execute().data

    total = len(all_data)
    categories: dict = {}
    women_friendly = 0
    student_eligible = 0

    for row in all_data:
        cat = row.get("category") or "Other"
        categories[cat] = categories.get(cat, 0) + 1
        if row.get("women_friendly"):
            women_friendly += 1
        if row.get("student_eligible"):
            student_eligible += 1

    return {
        "total": total,
        "categories": categories,
        "women_friendly": women_friendly,
        "student_eligible": student_eligible,
    }
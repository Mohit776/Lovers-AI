from fastapi import APIRouter

from services.search_service import SearchService

router = APIRouter()


@router.get("/")
def search(q: str):

    return SearchService.search(q)
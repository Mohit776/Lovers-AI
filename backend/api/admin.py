from fastapi import APIRouter

from services.discovery_service import DiscoveryService
from services.opportunity_pipeline import OpportunityPipeline
from db.supabase_client import supabase

router = APIRouter()


@router.post("/crawl")
def crawl():
    """Trigger a full discovery + pipeline run across all sources."""
    urls = DiscoveryService.discover()

    stats = {
        "success": 0,
        "skipped": 0,
        "error": 0,
    }

    for url in urls:
        result = OpportunityPipeline.process(url)
        if result in stats:
            stats[result] += 1

    return {
        "message": "Crawl completed",
        "urls_found": len(urls),
        "urls_added": stats["success"],
        "urls_skipped": stats["skipped"],
        "urls_error": stats["error"],
    }


@router.get("/crawl-logs")
def get_crawl_logs(limit: int = 10):
    """Return recent crawl history from the crawl_logs table."""
    try:
        response = (
            supabase
            .table("crawl_logs")
            .select("*")
            .order("started_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as e:
        return {"error": str(e), "logs": []}
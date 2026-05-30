from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler

from services.discovery_service import DiscoveryService
from services.opportunity_pipeline import OpportunityPipeline
from db.supabase_client import supabase


scheduler = BlockingScheduler()


def run_pipeline():
    """Main daily crawl job. Discovers URLs, processes each, and logs results."""
    started_at = datetime.utcnow()
    print(f"\n[Scheduler] Crawl started at {started_at.isoformat()}")

    urls = DiscoveryService.discover()

    stats = {
        "urls_found": len(urls),
        "urls_success": 0,
        "urls_skipped": 0,
        "urls_error": 0,
    }

    for url in urls:
        result = OpportunityPipeline.process(url)
        if result == "success":
            stats["urls_success"] += 1
        elif result == "skipped":
            stats["urls_skipped"] += 1
        else:
            stats["urls_error"] += 1

    finished_at = datetime.utcnow()

    print(
        f"[Scheduler] Crawl finished at {finished_at.isoformat()}\n"
        f"  Found:   {stats['urls_found']}\n"
        f"  Added:   {stats['urls_success']}\n"
        f"  Skipped: {stats['urls_skipped']}\n"
        f"  Errors:  {stats['urls_error']}"
    )

    # Log to Supabase crawl_logs table
    try:
        supabase.table("crawl_logs").insert({
            "started_at": started_at.isoformat(),
            "finished_at": finished_at.isoformat(),
            "urls_found": stats["urls_found"],
            "urls_success": stats["urls_success"],
            "urls_skipped": stats["urls_skipped"],
            "urls_error": stats["urls_error"],
        }).execute()
    except Exception as e:
        print(f"[Scheduler] Could not write crawl log: {e}")


# Run daily at 9:00 AM
scheduler.add_job(
    run_pipeline,
    "cron",
    hour=2,
    minute=2,
    name="daily_opportunity_crawl"
)

if __name__ == "__main__":
    print("[Scheduler] Running first crawl immediately on startup...")
    run_pipeline()
    print("[Scheduler] Starting daily scheduler (runs at 2:00 AM)...")
    scheduler.start()
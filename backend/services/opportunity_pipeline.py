import time

from scrapper.base_scraper import BaseScraper
from ai.groq_extractor import GroqExtractor
from services.duplicate_service import DuplicateService
from services.opportunity_service import OpportunityService


class OpportunityPipeline:

    @staticmethod
    def process(url):
        """Process a single URL through the full pipeline.
        
        - Skips duplicates
        - Fetches + cleans HTML
        - Extracts data via Groq AI
        - Upserts into Supabase
        - Sleeps briefly to avoid API rate limits
        """
        try:
            if DuplicateService.exists(url):
                return "skipped"

            scraper = BaseScraper()
            html = scraper.fetch(url)
            content = scraper.clean_text(html)

            extracted = GroqExtractor.extract(content)

            if not extracted:
                return "no_data"

            extracted["source_url"] = url

            OpportunityService.upsert(extracted)

            # Avoid Groq rate limits on free tier
            time.sleep(1.5)

            return "success"

        except Exception as e:
            print(f"[Pipeline] Error processing {url}: {e}")
            return "error"
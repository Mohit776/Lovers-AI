from scrapper.base_scraper import BaseScraper


class DiscoveryService:

    # Curated RSS feeds: government portals, newsletters, fellowships
    RSS_FEEDS = [
        # India Government - Ministry of Education
        "https://www.education.gov.in/rss.xml",
        # DAAD (German Academic Exchange)
        "https://www.daad.de/en/study-and-research-in-germany/scholarships/rss/",
        # Opportunity Desk RSS
        "https://opportunitydesk.org/feed/",
        # World Bank Funding
        "https://www.worldbank.org/en/news/rss",
        # UN Jobs / Opportunities
        "https://www.un.org/en/rss.xml",
        # British Council
        "https://www.britishcouncil.org/rss.xml",
        # Devex (development aid jobs/grants)
        "https://www.devex.com/news/rss.xml",
        # European Commission Funding
        "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/grants-search?latestUpdatesOnly=true",
    ]

    @staticmethod
    def discover() -> list[str]:
        urls = []

        # --- Opportunity Desk ---
        try:
            from scrapper.opportunity_desk import OpportunityDeskScraper
            scraper = OpportunityDeskScraper()
            urls.extend(scraper.discover())
            print(f"[Discovery] OpportunityDesk: {len(scraper.discover())} URLs")
        except Exception as e:
            print(f"[Discovery] OpportunityDesk error: {e}")

        # --- Youth Opportunities ---
        try:
            from scrapper.youth_opportunities import YouthOpportunitiesScraper
            scraper = YouthOpportunitiesScraper()
            found = scraper.discover()
            urls.extend(found)
            print(f"[Discovery] YouthOpportunities: {len(found)} URLs")
        except Exception as e:
            print(f"[Discovery] YouthOpportunities error: {e}")

        # --- Fellowships ---
        try:
            from scrapper.fellowship_scraper import FellowshipScraper
            scraper = FellowshipScraper()
            found = scraper.discover()
            urls.extend(found)
            print(f"[Discovery] Fellowships: {len(found)} URLs")
        except Exception as e:
            print(f"[Discovery] Fellowships error: {e}")

        # --- Universities ---
        try:
            from scrapper.university_scraper import UniversityScraper
            scraper = UniversityScraper()
            found = scraper.discover()
            urls.extend(found)
            print(f"[Discovery] Universities: {len(found)} URLs")
        except Exception as e:
            print(f"[Discovery] Universities error: {e}")

        # --- VC / Accelerators ---
        try:
            from scrapper.yc_scraper import YCScraper
            scraper = YCScraper()
            found = scraper.discover()
            urls.extend(found)
            print(f"[Discovery] Accelerators: {len(found)} URLs")
        except Exception as e:
            print(f"[Discovery] Accelerators error: {e}")

        # --- RSS Feeds ---
        try:
            from scrapper.rss_scraper import RssScraper
            scraper = RssScraper(DiscoveryService.RSS_FEEDS)
            found = scraper.discover()
            urls.extend(found)
            print(f"[Discovery] RSS feeds: {len(found)} URLs")
        except Exception as e:
            print(f"[Discovery] RSS error: {e}")

        unique_urls = list(set(urls))
        print(f"[Discovery] Total unique URLs: {len(unique_urls)}")
        return unique_urls
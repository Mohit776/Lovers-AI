from bs4 import BeautifulSoup
from scrapper.base_scraper import BaseScraper


class FellowshipScraper(BaseScraper):
    """Scrapes well-known fellowship program websites for opportunity links."""

    SOURCES = [
        # Fulbright
        "https://foreign.fulbrightonline.org/about/foreign-fulbright",
        # Chevening
        "https://www.chevening.org/scholarships/",
        # Gates Cambridge
        "https://www.gatescambridge.org/apply/",
        # Aga Khan Foundation
        "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme",
        # Commonwealth Scholarships
        "https://cscuk.fcdo.gov.uk/apply/",
        # Mandela Washington Fellowship
        "https://yali.state.gov/mwf/",
        # Atlas Corps
        "https://atlascorps.org/apply/",
        # Obama Foundation
        "https://www.obama.org/programs/",
    ]

    def discover(self) -> list[str]:
        """Returns the source pages themselves as the "opportunity" URLs.
        The pipeline's AI extractor will parse each page for fellowship details."""
        return list(set(self.SOURCES))

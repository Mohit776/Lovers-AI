from bs4 import BeautifulSoup

from scrapper.base_scraper import BaseScraper


class OpportunityDeskScraper(BaseScraper):

    BASE_URL = "https://opportunitydesk.org"

    def discover(self):

        html = self.fetch(self.BASE_URL)

        soup = BeautifulSoup(
            html,
            "html.parser"
        )

        urls = []

        for link in soup.find_all("a"):

            href = link.get("href")

            if href and "/202" in href:
                urls.append(href)

        return list(set(urls))
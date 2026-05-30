from bs4 import BeautifulSoup
from scrapper.base_scraper import BaseScraper


class YouthOpportunitiesScraper(BaseScraper):
    """Scrapes youthop.com for opportunity links."""

    BASE_URL = "https://youthop.com"

    PAGES = [
        "https://youthop.com/scholarships",
        "https://youthop.com/fellowships",
        "https://youthop.com/grants",
        "https://youthop.com/internships",
        "https://youthop.com/competitions",
    ]

    def discover(self) -> list[str]:
        urls = []

        for page_url in self.PAGES:
            try:
                html = self.fetch(page_url)
                soup = BeautifulSoup(html, "html.parser")

                for link in soup.find_all("a", href=True):
                    href = link["href"]
                    # Pick links that look like individual opportunity pages
                    if href and "youthop.com" in href and href.count("/") >= 4:
                        urls.append(href)
                    elif href and href.startswith("/") and href.count("/") >= 3:
                        urls.append(f"{self.BASE_URL}{href}")

            except Exception as e:
                print(f"[YouthOpportunities] Error scraping {page_url}: {e}")

        return list(set(urls))

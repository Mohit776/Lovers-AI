from bs4 import BeautifulSoup
from scrapper.base_scraper import BaseScraper


class YCScraper(BaseScraper):
    """Scrapes Y Combinator and other top accelerator pages for program links."""

    SOURCES = [
        # Y Combinator
        "https://www.ycombinator.com/apply",
        # Techstars
        "https://www.techstars.com/programs",
        # 500 Startups
        "https://500.co/accelerators",
    ]

    def discover(self) -> list[str]:
        urls = []

        for source_url in self.SOURCES:
            try:
                html = self.fetch(source_url)
                soup = BeautifulSoup(html, "html.parser")

                for link in soup.find_all("a", href=True):
                    href = link["href"]
                    # Filter for apply / program / batch pages
                    keywords = ["apply", "program", "batch", "accelerat", "fund", "startup"]
                    if any(kw in href.lower() for kw in keywords):
                        if href.startswith("http"):
                            urls.append(href)
                        elif href.startswith("/"):
                            base = "/".join(source_url.split("/")[:3])
                            urls.append(f"{base}{href}")

            except Exception as e:
                print(f"[YCScraper] Error scraping {source_url}: {e}")

        return list(set(urls))

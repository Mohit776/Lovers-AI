import feedparser
from scrapper.base_scraper import BaseScraper


class RssScraper(BaseScraper):
    """Generic RSS/Atom feed scraper.
    
    Pass any list of RSS feed URLs and it extracts all article links.
    """

    def __init__(self, feed_urls: list[str]):
        self.feed_urls = feed_urls

    def discover(self) -> list[str]:
        urls = []

        for feed_url in self.feed_urls:
            try:
                feed = feedparser.parse(feed_url)
                for entry in feed.entries:
                    link = entry.get("link")
                    if link:
                        urls.append(link)
            except Exception as e:
                print(f"[RssScraper] Error parsing feed {feed_url}: {e}")

        return list(set(urls))

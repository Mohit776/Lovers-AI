import requests
from bs4 import BeautifulSoup


class BaseScraper:

    def fetch(self, url: str):

        response = requests.get(
            url,
            timeout=20,
            headers={
                "User-Agent":
                "Mozilla/5.0"
            }
        )

        response.raise_for_status()

        return response.text

    def clean_text(self, html):

        soup = BeautifulSoup(
            html,
            "html.parser"
        )

        return soup.get_text(
            separator="\n",
            strip=True
        )
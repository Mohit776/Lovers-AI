from scrapper.base_scraper import BaseScraper


class UniversityScraper(BaseScraper):
    """Curated list of university scholarship and grant opportunity pages."""

    # Direct links to scholarship/opportunity listing pages at top universities
    SOURCES = [
        # MIT
        "https://oge.mit.edu/finances/fellowships/",
        # Stanford
        "https://graddiversity.stanford.edu/fellowships",
        # Harvard
        "https://gsas.harvard.edu/financial-support/fellowships",
        # Oxford
        "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/fees-funding-and-scholarship-search",
        # Cambridge
        "https://www.cambridgetrust.org/scholarships/",
        # IIT Delhi (India)
        "https://home.iitd.ac.in/scholarships-iitd.php",
        # TIFR (India)
        "https://www.tifr.res.in/~gsp/",
        # UC Berkeley
        "https://grad.berkeley.edu/financial/fellowships/",
        # ETH Zurich
        "https://ethz.ch/en/studies/financial/scholarships.html",
        # National University of Singapore
        "https://www.nus.edu.sg/oam/scholarships/scholarships-for-international-students",
    ]

    def discover(self) -> list[str]:
        """Returns curated university scholarship pages for AI extraction."""
        return list(set(self.SOURCES))

import json
import re
from datetime import datetime

from ai.groq_ai import client
from ai.prompt import OPPORTUNITY_EXTRACTION_PROMPT

# Common date format patterns returned by AI
_DATE_FORMATS = [
    "%Y-%m-%d",
    "%B %d, %Y",
    "%b %d, %Y",
    "%d %B %Y",
    "%d %b %Y",
    "%B %d %Y",
    "%b %d %Y",
    "%m/%d/%Y",
    "%d/%m/%Y",
    "%Y/%m/%d",
]


def _sanitize_date(value: str) -> str | None:
    """Convert any date string to YYYY-MM-DD or return None if unparseable."""
    if not value:
        return None
    value = str(value).strip()
    for fmt in _DATE_FORMATS:
        try:
            return datetime.strptime(value, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    # Try to extract a year and month from partial dates like "June 10"
    try:
        # Add current year if only month + day
        current_year = datetime.now().year
        dt = datetime.strptime(f"{value} {current_year}", "%B %d %Y")
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        pass
    return None


class GroqExtractor:

    @staticmethod
    def extract(content: str):

        response = client.chat.completions.create(
            model="llama-3.3-8b-instant",
            temperature=0,
            messages=[
                {
                    "role": "system",
                    "content": OPPORTUNITY_EXTRACTION_PROMPT
                },
                {
                    "role": "user",
                    "content": content[:12000]
                }
            ]
        )

        result = response.choices[0].message.content

        # Strip markdown code block formatting
        if result.startswith("```"):
            result = result.strip("`").removeprefix("json").strip()

        try:
            parsed = json.loads(result)

            # Sanitize deadline to proper ISO date or null
            if parsed.get("deadline"):
                parsed["deadline"] = _sanitize_date(parsed["deadline"])

            # Coerce tags list to comma-separated string
            if isinstance(parsed.get("tags"), list):
                parsed["tags"] = ", ".join(parsed["tags"])

            # Coerce funding_amount to string
            if parsed.get("funding_amount") is not None:
                parsed["funding_amount"] = str(parsed["funding_amount"])

            return parsed

        except Exception:
            return None
OPPORTUNITY_EXTRACTION_PROMPT = """
You are an expert data extraction system.

Extract the following fields from the opportunity page.

Return ONLY valid JSON.

Fields:

title
organization
country
deadline
category
description
funding_amount
application_link
remote
women_friendly
student_eligible
indian_eligible
application_fee
tags

If a field is missing return null.
"""

SEARCH_PROMPT = """
Convert the user query into filters.

Return only JSON.

Fields:

category
country
women_friendly
student_eligible
indian_eligible
tags
"""
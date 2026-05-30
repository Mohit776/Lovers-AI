import json

from ai.groq_ai import client
from ai.prompt import SEARCH_PROMPT


class SearchParser:

    @staticmethod
    def parse(query):

        response = (
            client.chat.completions.create(
                model="llama-3.1-8b-instant",
                temperature=0,
                messages=[
                    {
                        "role": "system",
                        "content": SEARCH_PROMPT
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ]
            )
        )

        return json.loads(
            response
            .choices[0]
            .message
            .content
        )
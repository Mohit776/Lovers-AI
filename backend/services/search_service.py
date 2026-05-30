from db.supabase_client import supabase
from ai.search_parser import SearchParser


class SearchService:

    @staticmethod
    def search(query):

        filters = (
            SearchParser.parse(query)
        )

        db_query = (
            supabase
            .table("opportunities")
            .select("*")
        )

        if filters.get("women_friendly"):
            db_query = db_query.eq(
                "women_friendly",
                True
            )

        if filters.get("category"):
            db_query = db_query.eq(
                "category",
                filters["category"]
            )

        if filters.get("country"):
            db_query = db_query.eq(
                "country",
                filters["country"]
            )

        return db_query.execute().data
from db.supabase_client import supabase


class OpportunityService:

    @staticmethod
    def create(data: dict):

        result = (
            supabase
            .table("opportunities")
            .insert(data)
            .execute()
        )

        return result.data

    @staticmethod
    def upsert(data: dict):
        """Insert or update an opportunity using source_url as the unique key.
        Ensures re-crawling the same URL updates the existing record."""

        result = (
            supabase
            .table("opportunities")
            .upsert(data, on_conflict="source_url")
            .execute()
        )

        return result.data

    @staticmethod
    def get_all():

        result = (
            supabase
            .table("opportunities")
            .select("*")
            .execute()
        )

        return result.data

    @staticmethod
    def get_by_id(opportunity_id: str):

        result = (
            supabase
            .table("opportunities")
            .select("*")
            .eq("id", opportunity_id)
            .execute()
        )

        return result.data[0] if result.data else None

from db.supabase_client import supabase


class DuplicateService:

    @staticmethod
    def exists(source_url):

        result = (
            supabase
            .table("opportunities")
            .select("id")
            .eq("source_url", source_url)
            .execute()
        )

        return len(result.data) > 0
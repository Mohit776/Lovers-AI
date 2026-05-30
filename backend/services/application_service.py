from db.supabase_client import supabase


class ApplicationService:

    @staticmethod
    def create(data: dict):

        result = (
            supabase
            .table("applications")
            .insert(data)
            .execute()
        )

        return result.data

    @staticmethod
    def get_all():

        result = (
            supabase
            .table("applications")
            .select("*")
            .execute()
        )

        return result.data

    @staticmethod
    def update(application_id, data):

        result = (
            supabase
            .table("applications")
            .update(data)
            .eq("id", application_id)
            .execute()
        )

        return result.data
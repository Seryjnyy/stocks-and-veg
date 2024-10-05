import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetUserProfile = ({
    user_id,
}: {
    user_id: string | undefined;
}) => {
    return useQuery(
        supabase
            .from("profile")
            .select("*")
            .eq("user_id", user_id ?? "")
            .limit(1)
            .maybeSingle(),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: !!user_id,
        }
    );
};

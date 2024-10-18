import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetGroupTomatoUser = ({
    groupID,
    userID,
    enabled = true,
}: {
    groupID: string;
    userID: string;
    enabled?: boolean;
}) => {
    return useQuery(
        supabase
            .from("tomato_target")
            .select("*")
            .eq("user_id", userID)
            .eq("group_id", groupID)
            .limit(1)
            .maybeSingle(),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetGroupTomatoTargets = ({
    groupID,

    enabled = true,
}: {
    groupID: string;
    enabled?: boolean;
}) => {
    return useQuery(
        supabase.from("tomato_target").select("*").eq("group_id", groupID),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

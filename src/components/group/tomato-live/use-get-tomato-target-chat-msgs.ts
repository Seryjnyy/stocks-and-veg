import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetTomatoTargetChatMsgs = ({
    tomatoTargetID,
    enabled = true,
}: {
    tomatoTargetID: string;
    enabled?: boolean;
}) => {
    return useQuery(
        supabase
            .from("test_realtime")
            .select("*")
            .eq("tomato_target_id", tomatoTargetID),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

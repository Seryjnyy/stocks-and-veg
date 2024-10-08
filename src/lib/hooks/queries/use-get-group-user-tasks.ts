import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryData, Session } from "@supabase/supabase-js";

// TODO : idk if this is necessary, you could get group tasks, then filter
// since group tasks query will probably be used anyway it seems it would be more efficient to use that instead of two separate trips, but idk
export const useGetGroupUserTasks = ({
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
            .from("task")
            .select("*, task_completion(*)")
            .eq("group_id", groupID)
            .eq("user_id", userID)
            .limit(1, { foreignTable: "task_completion" }),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

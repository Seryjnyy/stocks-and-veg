import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetUserGroupTasks = ({
    groupID,
    userID,
    enabled,
}: {
    groupID: string | undefined;
    userID: string | undefined;
    enabled?: boolean;
}) => {
    return useQuery(
        supabase
            .from("task")
            .select("*, task_completion(*)")
            .eq("group_id", groupID ?? "")
            .eq("user_id", userID ?? "")
            .limit(1, { foreignTable: "task_completion" }),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: !!groupID && !!userID && enabled,
        }
    );
};

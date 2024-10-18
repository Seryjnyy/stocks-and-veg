import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetGroupTasks = ({
    groupID,
}: {
    groupID: string | undefined;
}) => {
    return useQuery(
        supabase
            .from("task")
            .select("*, task_completion(*)")
            .eq("group_id", groupID ?? "")
            .limit(1, { foreignTable: "task_completion" }),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: !!groupID,
        }
    );
};

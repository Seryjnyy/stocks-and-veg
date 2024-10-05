import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryData, Session } from "@supabase/supabase-js";

const query = supabase
    .from("task")
    .select("*, task_completion(*)")
    .eq("group_id", "")
    .limit(1, { foreignTable: "task_completion" })
    .single();

export type TaskWithCompletion = QueryData<typeof query>;

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

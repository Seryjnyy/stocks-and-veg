import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetTaskCompletionToday = ({
    task_id,
}: {
    task_id: string | undefined;
}) => {
    return useQuery(
        supabase
            .from("task_completion")
            .select("id,completed_at,task_id,group_id,user_id,date")
            .eq("task_id", task_id ?? "")
            .eq("date", new Date().toISOString().split("T")[0])
            .limit(1)
            .maybeSingle(),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: !!task_id,
        }
    );
};

import supabase from "@/lib/supabase/supabaseClient";
import { useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useUpdateTaskCompletion = () => {
    return useUpdateMutation(supabase.from("task_completion"), ["id"], "", {
        revalidateRelations: [
            {
                relation: "task",
                relationIdColumn: "task_id",
                fKeyColumn: "id",
            },
        ],
    });
};

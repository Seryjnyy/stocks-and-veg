import supabase from "@/lib/supabase/supabaseClient";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";

// revalidateRelations work weird here, ibr i don't get it, but it works
export const useCreateTaskCompletion = () => {
    return useInsertMutation(supabase.from("task_completion"), ["id"], "", {
        revalidateRelations: [
            {
                relation: "task",
                relationIdColumn: "id",
                fKeyColumn: "task_id",
            },
        ],
    });
};

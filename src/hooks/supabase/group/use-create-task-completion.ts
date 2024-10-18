import supabase from "@/lib/supabase/supabaseClient";
import { GenericSupabaseQueryProps } from "@/lib/types";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { error } from "console";

export const useCreateTaskCompletion = () => {
    return useInsertMutation(
        supabase.from("task_completion"),
        ["id"],
        "",
        {
            revalidateRelations: [
                {
                    relation: "task",
                    relationIdColumn: "id",
                    fKeyColumn: "task_id",
                },
            ],
        }
        // {
        //     revalidateTables: [{ table: "task_completion", schema: "public" }],
        // }
    );
};

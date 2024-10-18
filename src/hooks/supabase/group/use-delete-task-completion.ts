import supabase from "@/lib/supabase/supabaseClient";
import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useDeleteTaskCompletion = () => {
    return useDeleteMutation(
        supabase.from("task_completion"),
        ["id"],
        "task_id",
        // {
        //     revalidateRelations: [
        //         {
        //             relation: "task",
        //             relationIdColumn: "id",
        //             fKeyColumn: "task_id",
        //         },
        //     ],
        // }
        {
            // revalidateTables: [{ table: "task", schema: "public" }],
            revalidateRelations: [
                {
                    relation: "task",
                    relationIdColumn: "id",
                    fKeyColumn: "task_id",
                },
            ],
        }
    );
};

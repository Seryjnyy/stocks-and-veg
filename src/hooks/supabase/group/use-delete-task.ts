import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";
import supabase from "@/lib/supabase/supabaseClient";

// TODO : Idk this feels dumb, it works but it doesn't feel right idk
export const useDeleteTask = () => {
    return useDeleteMutation(supabase.from("task"), ["id"], "", {
        revalidateTables: [{ table: "task", schema: "public" }],
        revalidateRelations: [
            {
                relation: "task_completion",
                relationIdColumn: "task_id",
                fKeyColumn: "id",
            },
        ],
    });
};

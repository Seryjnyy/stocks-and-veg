import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";
import supabase from "@/lib/supabase/supabaseClient";

export const useDeleteGroupUser = () => {
    return useDeleteMutation(supabase.from("group_user"), ["id"], "", {
        revalidateTables: [
            // { table: "group", schema: "public" },
            { table: "group_user", schema: "public" },
        ],
        revalidateRelations: [
            {
                relation: "tomato",
                relationIdColumn: "user_id",
                fKeyColumn: "id",
            },
        ],
    });
};

import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";
import supabase from "@/lib/supabase/supabaseClient";

// TODO : Idk this feels dumb, it works but it doesn't feel right idk
export const useDeleteGroup = () => {
    return useDeleteMutation(supabase.from("group"), ["id"], "", {
        revalidateTables: [{ table: "group", schema: "public" }],
        revalidateRelations: [
            {
                relation: "group_user",
                relationIdColumn: "group_id",
                fKeyColumn: "id",
            },
        ],
    });
};

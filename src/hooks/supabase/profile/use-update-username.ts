import supabase from "@/lib/supabase/supabaseClient";
import { useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";

// TODO : This is not very good, i have to revalidate group_user table because group user in group is joined with profile table
// So when username is updated the group user cache is no longer correct
export const useUpdateUsername = () => {
    return useUpdateMutation(supabase.from("profile"), ["id"], "", {
        revalidateTables: [
            { table: "profile", schema: "public" },
            { table: "group_user", schema: "public" },
        ],
    });
};

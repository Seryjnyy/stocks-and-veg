import supabase from "@/lib/supabase/supabaseClient";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useCreateGroup = () => {
    return useInsertMutation(supabase.from("group"), ["id"], "", {
        onSuccess: () => console.log("Success!"),
    });
};

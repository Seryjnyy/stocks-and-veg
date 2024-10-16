import supabase from "@/lib/supabase/supabaseClient";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useCreateTask = () => {
    return useInsertMutation(supabase.from("task"), ["id"], "");
};

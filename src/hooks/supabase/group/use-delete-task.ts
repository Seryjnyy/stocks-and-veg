import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";
import supabase from "@/lib/supabase/supabaseClient";

export const useDeleteTask = () => {
    return useDeleteMutation(supabase.from("task"), ["id"], "");
};

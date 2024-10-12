import supabase from "@/lib/supabase/supabaseClient";
import { GenericSupabaseQueryProps } from "@/lib/types";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { error } from "console";

export const useCreateTask = () => {
    return useInsertMutation(supabase.from("task"), ["id"], "");
};

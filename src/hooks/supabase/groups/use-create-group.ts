import supabase from "@/lib/supabase/supabaseClient";
import { GenericSupabaseQueryProps } from "@/lib/types";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { error } from "console";

// Db gets user id automatically
// TODO : You have to pass {} to query if you dont want to use props, idk I don't like it
export const useCreateGroup = () => {
    return useInsertMutation(supabase.from("group"), ["id"], "");
};

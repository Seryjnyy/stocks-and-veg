import supabase from "@/lib/supabase/supabaseClient";
import { GenericSupabaseQueryProps } from "@/lib/types";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { error } from "console";

// TODO : the way im using this stuff don't make sense, im just returning the useQuery everywhere
export const useAddUserToGroup = () => {
    return useInsertMutation(supabase.from("group_user"), ["id"], "");
};

import supabase from "@/lib/supabase/supabaseClient";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useCreateChatMsg = () => {
    return useInsertMutation(supabase.from("test_realtime"), ["id"], "");
};

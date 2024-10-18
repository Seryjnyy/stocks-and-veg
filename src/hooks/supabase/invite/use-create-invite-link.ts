import supabase from "@/lib/supabase/supabaseClient";
import { useUpsertMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useCreateInviteLink = () => {
    return useUpsertMutation(supabase.from("invite_link"), ["id"], "");
};

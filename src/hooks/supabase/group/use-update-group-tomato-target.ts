import supabase from "@/lib/supabase/supabaseClient";
import { useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useUpdateTomatoTarget = () => {
    return useUpdateMutation(supabase.from("tomato_target"), ["id"], "");
};

import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Session } from "@supabase/supabase-js";

// TODO : data needs to be transformed before returning, idk how to do that here, so bit annoying
export const useGetUserGroups = ({
    user_id,
}: {
    user_id: string | undefined;
}) => {
    return useQuery(
        supabase
            .from("group_user")
            .select("*, group(*)")
            .eq("user_id", user_id ?? ""),
        {
            enabled: !!user_id,
        }
    );
};

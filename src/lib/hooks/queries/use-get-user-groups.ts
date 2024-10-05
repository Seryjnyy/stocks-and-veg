import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Session } from "@supabase/supabase-js";

export const useGetUserGroups = ({
    user_id,
}: {
    user_id: string | undefined;
}) => {
    return useQuery(
        supabase
            .from("group")
            .select("*")
            .eq("creator_id", user_id ?? ""),
        {
            enabled: !!user_id,
        }
    );
};

import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Session } from "@supabase/supabase-js";

export const useGetGroupUser = ({
    groupID,
    userID,
    enabled,
}: {
    groupID: string | undefined;
    userID: string | undefined;
    enabled: boolean;
}) => {
    return useQuery(
        supabase
            .from("group_user")
            .select("*")
            .eq("group_id", groupID ?? "")
            .eq("user_id", userID ?? ""),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

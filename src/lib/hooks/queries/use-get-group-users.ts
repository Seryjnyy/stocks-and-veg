import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Session } from "@supabase/supabase-js";

export const useGetGroupUsers = ({
    groupID,
}: {
    groupID: string | undefined;
}) => {
    return useQuery(
        supabase
            .from("group_user")
            .select("*")
            .eq("group_id", groupID ?? ""),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: !!groupID,
        }
    );
};

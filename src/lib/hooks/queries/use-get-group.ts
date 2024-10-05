import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetGroup = ({
    groupID,
    enabled,
}: {
    groupID: string;
    enabled: boolean;
}) => {
    return useQuery(
        supabase
            .from("group")
            .select("*")
            .eq("id", groupID)
            .limit(1)
            .maybeSingle(),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

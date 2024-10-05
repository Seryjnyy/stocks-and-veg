import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Session } from "@supabase/supabase-js";

export const useGetUserGroup = ({
    groupID,
    session,
}: {
    groupID: string;
    session: Session | null;
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
            enabled: !!session,
        }
    );
};

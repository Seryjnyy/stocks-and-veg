import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Session } from "@supabase/supabase-js";

export const useGetInviteLink = ({
    groupID,
}: {
    groupID: string | undefined;
}) => {
    return useQuery(
        supabase
            .from("invite_link")
            .select("*")
            .eq("group_id", groupID ?? "")
            .limit(1)
            .maybeSingle(),
        {
            enabled: !!groupID,
        }
    );
};

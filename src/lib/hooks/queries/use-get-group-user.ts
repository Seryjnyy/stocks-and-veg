import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { GroupUserWithProfile } from "./use-get-group-users";

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
            .select("*, profile:get_group_user_profile(*)")
            .eq("group_id", groupID ?? "")
            .eq("user_id", userID ?? "")
            .limit(1)
            .returns<GroupUserWithProfile[]>(),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

import { Tables } from "@/lib/supabase/database.types";
import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export interface GroupUserWithProfile extends Tables<"group_user"> {
    profile: Tables<"profile"> | undefined;
}

// Why did I spend so long to try join these tables ._.
export const useGetGroupUsers = ({
    groupID,
}: {
    groupID: string | undefined;
}) => {
    return useQuery(
        supabase
            .from("group_user")
            .select("*, profile:get_group_user_profile(*)")
            .eq("group_id", groupID ?? "")
            .returns<GroupUserWithProfile[]>(),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: !!groupID,
        }
    );
};

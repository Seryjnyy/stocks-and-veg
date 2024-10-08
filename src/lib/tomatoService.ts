import supabase from "@/lib/supabase/supabaseClient";
import {
    useInsertMutation,
    useQuery,
    useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";

export const useGetGroupUserTomato = ({
    groupID,
    userID,
    enabled = true,
}: {
    groupID: string;
    userID: string;
    enabled?: boolean;
}) => {
    return useQuery(
        supabase
            .from("tomato_target")
            .select("*")
            .eq("user_id", userID)
            .eq("group_id", groupID)
            .limit(1)
            .maybeSingle(),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

export const useGetGroupTomatoes = ({
    groupID,

    enabled = true,
}: {
    groupID: string;
    enabled?: boolean;
}) => {
    return useQuery(
        supabase.from("tomato_target").select("*").eq("group_id", groupID),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

export const useUpdateTomatoTarget = () => {
    return useUpdateMutation(supabase.from("tomato_target"), ["id"], "");
};

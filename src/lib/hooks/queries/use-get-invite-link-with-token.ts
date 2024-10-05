import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Session } from "@supabase/supabase-js";

export const useGetInviteLinkWithToken = ({
    token,
    enabled,
}: {
    token: string | undefined;
    enabled: boolean;
}) => {
    return useQuery(
        supabase
            .from("invite_link")
            .select("*, group(*)")
            .eq("token", token ?? "")
            .limit(1)
            .maybeSingle(),
        {
            enabled: enabled,
        }
    );
};

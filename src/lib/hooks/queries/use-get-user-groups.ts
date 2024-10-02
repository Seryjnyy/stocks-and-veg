import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Session } from "@supabase/supabase-js";

export const useGetUserGroups = ({ session }: { session: Session | null }) => {
    return useQuery(
        supabase
            .from("group_user")
            .select("*")
            .eq("user_id", session?.user.id ?? ""),
        {
            enabled: !!session,
        }
    );
};

import supabase from "@/lib/supabase/supabaseClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const useGetWorkStatus = () => {
    return useQuery(
        supabase
            .from("feature_control")
            .select("*")
            .eq("type", "daily_work")
            .limit(1)
            .maybeSingle(),
        {
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
            refetchInterval: 10000, // TODO : decide on interval
        }
    );
};

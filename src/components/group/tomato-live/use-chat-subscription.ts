import supabase from "@/lib/supabase/supabaseClient";
import { useSubscription } from "@supabase-cache-helpers/postgrest-react-query";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { GenericTable } from "@supabase/supabase-js/dist/module/lib/types";

export const useChatSubscription = ({
    channelName,
    tomatoTargetID,
    callback,
}: {
    channelName: string;
    tomatoTargetID: string;
    callback?: (payload: RealtimePostgresChangesPayload<GenericTable>) => void;
}) => {
    return useSubscription(
        supabase,
        channelName,
        {
            event: "*",
            table: "test_realtime",
            schema: "public",
            filter: `tomato_target_id=eq.${tomatoTargetID}`,
        },
        ["id"],
        {
            callback: callback,
            onError: (error) => {
                console.error(error);
            },
        }
    );
};

import supabase from "@/lib/supabase/supabaseClient";
import { useFileUrl } from "@supabase-cache-helpers/storage-react-query";

export const useGetUserAvatar = ({
    user_id,
    enabled,
}: {
    user_id: string | undefined;
    enabled: boolean;
}) => {
    return useFileUrl(
        supabase.storage.from("avatar"),
        `${user_id}/${user_id}.png`,
        "private",
        {
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

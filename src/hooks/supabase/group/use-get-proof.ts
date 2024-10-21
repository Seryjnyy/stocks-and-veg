import supabase from "@/lib/supabase/supabaseClient";
import { useFileUrl } from "@supabase-cache-helpers/storage-react-query";

export const useGetProof = ({
    proofPath,
    enabled,
}: {
    proofPath: string | undefined;
    enabled: boolean;
}) => {
    return useFileUrl(
        supabase.storage.from("proof"),
        `${proofPath}`,
        "private",
        {
            refetchOnWindowFocus: false,
            enabled: enabled,
        }
    );
};

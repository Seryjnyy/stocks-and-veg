import supabase from "@/lib/supabase/supabaseClient";
import { useUpload } from "@supabase-cache-helpers/storage-react-query";

export const useUploadTaskCompletionProof = ({
    taskCompletionID,
}: {
    taskCompletionID: string;
}) => {
    return useUpload(supabase.storage.from("proof"), {
        upsert: true,
        buildFileName: ({ fileName, path }) => `${path}/${taskCompletionID}`,
    });
};

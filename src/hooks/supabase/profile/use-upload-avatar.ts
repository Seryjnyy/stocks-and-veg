import supabase from "@/lib/supabase/supabaseClient";
import { useUpload } from "@supabase-cache-helpers/storage-react-query";
import { Session } from "@supabase/supabase-js";

export const useUploadAvatar = () => {
    return useUpload(supabase.storage.from("avatar"), {
        upsert: true,
        buildFileName: ({ fileName, path }) => `${path}/${fileName}`,
    });
};

import supabase from "@/lib/supabase/supabaseClient";
import { useRemoveFiles } from "@supabase-cache-helpers/storage-react-query";

export const useDeleteProof = () => {
    return useRemoveFiles(supabase.storage.from("proof"));
};

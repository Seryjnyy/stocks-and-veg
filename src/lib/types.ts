import { PostgrestError } from "@supabase/supabase-js";

export interface GenericFormProps {
    onSuccess?: () => void;
    onError?: () => void;
}

export interface GenericSupabaseQueryProps {
    onSuccess?: () => void;
    onError?: (error: PostgrestError) => void;
}

import { PostgrestError, QueryData } from "@supabase/supabase-js";
import supabase from "./supabase/supabaseClient";

export interface GenericFormProps {
    onSuccess?: () => void;
    onError?: () => void;
    disabled?: boolean;
}

export type GroupSection = {
    icon: React.ElementType;
    label: string;
    value: string;
    section: React.ReactNode;
};

export interface GenericSupabaseQueryProps {
    onSuccess?: () => void;
    onError?: (error: PostgrestError) => void;
}

const query = supabase
    .from("task")
    .select("*, task_completion(*)")
    .eq("group_id", "")
    .limit(1, { foreignTable: "task_completion" })
    .single();

export type TaskWithCompletion = QueryData<typeof query>;

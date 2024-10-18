import { isWorkEnabledAtom } from "@/atoms/atoms";

import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { useGetWorkStatus } from "./supabase/use-get-work-status";

// TODO : Idk if its better to have work disabled by default or not
export default function useWorkStatus() {
    const [isWorkEnabled, setIsWorkEnabled] = useAtom(isWorkEnabledAtom);
    const { data: workStatus, isLoading: isWorkStatusLoading } =
        useGetWorkStatus();

    useEffect(() => {
        if (workStatus) {
            setIsWorkEnabled(workStatus.is_enabled);
        }
    }, [workStatus]);

    return isWorkEnabled;
}

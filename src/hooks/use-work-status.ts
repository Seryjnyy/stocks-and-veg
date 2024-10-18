import { isWorkEnabledAtom } from "@/atoms/atoms";
import { useGetWorkStatus } from "@/lib/hooks/queries/use-get-work-status";
import { useAtom } from "jotai";
import React, { useEffect } from "react";

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

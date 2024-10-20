import { isWorkEnabledAtom } from "@/atoms/atoms";

import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { useGetWorkStatus } from "./supabase/use-get-work-status";

// TODO : Idk if its better to have work disabled by default or not
export default function useWorkStatus() {
    // TODO : why are we using atom for this when its using tanstack query, no point
    const [isWorkEnabled, setIsWorkEnabled] = useAtom(isWorkEnabledAtom);
    const {
        data: workStatus,
        isLoading: isWorkStatusLoading,
        refetch: refetchWorkStatus,
    } = useGetWorkStatus();

    useEffect(() => {
        if (workStatus) {
            // Incase somehow work status is enabled but expired (something would have to be messed up on the db, hopefully never happens)
            const timeNow = Date.now();

            const isBeforeExpire =
                timeNow < new Date(workStatus.expires_at).getTime();
            const isAfterStart =
                timeNow > new Date(workStatus.starts_at).getTime();

            const isValid =
                isBeforeExpire && isAfterStart && workStatus.is_enabled;

            setIsWorkEnabled(isValid);
        }
    }, [workStatus]);

    return {
        isWorkEnabled,
        enabledTill: workStatus?.expires_at,
        revalidatedAt: workStatus
            ? new Date(workStatus.revalidated_at).getTime()
            : null,
        startsAt: workStatus ? new Date(workStatus.starts_at).getTime() : null,
        refetchWorkStatus,
        isWorkStatusLoading,
    };
}

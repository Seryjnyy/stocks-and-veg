import { useMemo } from "react";

import { calculateLevel } from "@/lib/utils";

import { calculateXPForNextLevel } from "@/lib/utils";

const useLevel = ({ xp }: { xp: number }) => {
    const k = useMemo(() => {
        const level = calculateLevel(xp);
        const xpForNextLevel = calculateXPForNextLevel(level);

        const normalisedCurrentXP = xp - calculateXPForNextLevel(level - 1);
        const normalisedNextXP =
            xpForNextLevel - calculateXPForNextLevel(level - 1);
        const progressToNextLevel = Math.floor(
            (normalisedCurrentXP / normalisedNextXP) * 100
        );

        return { xp, level, xpForNextLevel, progressToNextLevel };
    }, [xp]);

    return k;
};

export default useLevel;

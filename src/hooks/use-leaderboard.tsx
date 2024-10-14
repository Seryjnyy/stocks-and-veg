import { useGetGroupUsers } from "@/lib/hooks/queries/use-get-group-users";
import { useMemo } from "react";

export default function useLeaderboard({
    groupID,
    userID,
}: {
    groupID: string;
    userID: string;
}) {
    const { data, isLoading, isError } = useGetGroupUsers({ groupID });

    const leaderboardData = useMemo(() => {
        if (!data) return null;

        const sorted = [...data].sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0));

        const userPosition = sorted.findIndex((user) => user.user_id == userID);

        const getAdjacentUsers = (adjacentCount: number) => {
            if (userPosition == -1) return [];

            const startIndex = Math.max(0, userPosition - adjacentCount);
            const endIndex = Math.min(
                sorted.length - 1,
                userPosition + adjacentCount
            );

            return sorted
                .slice(startIndex, endIndex + 1)
                .map((user, index) => ({
                    position: startIndex + index + 1,
                    user,
                }));
        };

        return {
            sorted,
            userPosition: userPosition !== -1 ? userPosition + 1 : null,
            getAdjacentUsers,
        };
    }, [data, userID]);

    return {
        leaderboardData,
        isLoading,
        isError,
    };
}

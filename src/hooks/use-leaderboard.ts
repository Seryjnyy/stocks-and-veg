import { orderOptions, sortByOptions } from "@/constants/leaderboard-options";
import { useGetGroupUsers } from "@/hooks/supabase/group/use-get-group-users";
import { useMemo, useState } from "react";

export type SortBy = (typeof sortByOptions)[number]["value"];
export type Order = (typeof orderOptions)[number]["value"];

export default function useLeaderboard({
    groupID,
    userID,
}: {
    groupID: string;
    userID?: string;
}) {
    const defaultSortBy: SortBy = "xp";
    const defaultOrder: Order = "desc";
    const [sortBy, setSortBy] = useState<SortBy>(defaultSortBy);
    const [order, setOrder] = useState<Order>(defaultOrder);
    const { data, isLoading, isError } = useGetGroupUsers({ groupID });

    const leaderboardData = useMemo(() => {
        if (!data) return null;

        const sorted = [...data].sort((a, b) => {
            if (order == "asc") {
                return (a[sortBy] ?? 0) - (b[sortBy] ?? 0);
            } else {
                return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
            }
        });

        const userPosition = sorted.findIndex((user) => user.user_id == userID);

        // TODO : is the function here a good idea?
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
                    value: user[sortBy],
                    user,
                }));
        };

        return {
            sorted,
            userPosition: userPosition !== -1 ? userPosition + 1 : null,
            getAdjacentUsers,
        };
    }, [data, userID, sortBy, order]);

    return {
        leaderboardData,
        isLoading,
        isError,
        sort: {
            setOrder,
            setSortBy,
            sortBy,
            order,
            defaultOrder,
            defaultSortBy,
        },
    };
}

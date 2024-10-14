import useLeaderboard from "@/hooks/use-leaderboard";
import { addOrdinalSuffix, cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import GroupUserProfile from "./group-user-profile";
import useScreenSize from "@/hooks/use-screen-size";

export default function LeaderboardList({
    groupID,
    userID,
    userDetailSize = "2xl",
}: {
    groupID: string;
    userID: string;
    userDetailSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}) {
    const { leaderboardData, isLoading, isError } = useLeaderboard({
        groupID,
        userID,
    });

    if (isLoading) return <Skeleton className="w-full h-10" />;

    if (isError || !leaderboardData) return null;

    return (
        <>
            <div className="flex flex-col gap-1  w-full items-end">
                {leaderboardData.getAdjacentUsers(2).map((user) => (
                    <div
                        key={user.user.user_id}
                        className={cn(
                            "border px- h-fit flex items-center rounded-md w-fit",
                            user.position == leaderboardData.userPosition &&
                                "bg-secondary"
                        )}
                    >
                        <span className="text-xs text-muted-foreground  w-[6ch] text-center">
                            {user.position <= 3
                                ? addOrdinalSuffix(user.position)
                                : user.position}
                        </span>
                        <GroupUserProfile
                            groupUser={user.user}
                            avatarSize={"md"}
                            detailSize={userDetailSize}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

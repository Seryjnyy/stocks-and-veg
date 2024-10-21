import { useAuth } from "@/hooks/use-auth";
import LeaderboardList from "../leaderboard-list";

export default function Leaderboard({ groupID }: { groupID: string }) {
    const { session } = useAuth();

    return (
        <div className=" w-full flex justify-center">
            <LeaderboardList
                groupID={groupID}
                userID={session?.user.id}
                userViewMore
                viewStat
                userDetailSize="sm"
            />
        </div>
    );
}

import React from "react";
import LeaderboardList from "../leaderboard-list";
import { useAuth } from "@/hooks/use-auth";

export default function Leaderboard({ groupID }: { groupID: string }) {
    const { session } = useAuth();

    return (
        <div className=" w-full flex justify-center">
            <LeaderboardList groupID={groupID} userID={session?.user.id} />
        </div>
    );
}

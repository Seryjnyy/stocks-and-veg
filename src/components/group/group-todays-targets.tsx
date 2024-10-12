import DataError from "@/components/data-error";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { useAuth } from "@/hooks/use-auth";

import { Tables } from "@/lib/supabase/database.types";
import { useGetGroupTomatoes } from "@/lib/tomatoService";
import GroupUserProfile from "./group-user-profile";
import { cn, TOMATO_EMOJI } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import CountdownTimer from "../countdown-timer";
import { InView } from "react-intersection-observer";
import { currentSectionInGroupPageAtom } from "@/lib/atoms/current-section-group-page";
import { useAtom } from "jotai";
import { ArrowDown } from "lucide-react";

const Target = ({ target }: { target: Tables<"tomato_target"> }) => {
    const { session } = useAuth();
    const { data, isError, isLoading } = useGetGroupUser({
        groupID: target.group_id,
        userID: target.user_id,
    });

    const isUs = session && session.user.id == target.user_id;

    console.log(session?.user.id, target.user_id);

    return (
        <div className="flex justify-between items-center border p-4">
            {data && <GroupUserProfile groupUser={data} />}
            <div className="flex flex-col">
                <span>Tomatoes received</span>
                <span>{target.tomatoes_received}</span>
            </div>
            {isUs ? (
                <Link
                    to="/groups/$groupID/tomato/$userID"
                    params={{
                        groupID: target.group_id,
                        userID: target.user_id,
                    }}
                >
                    <Button>Chuck tomatoes {TOMATO_EMOJI}</Button>
                </Link>
            ) : (
                <Link
                    to="/groups/$groupID/tomato/$userID"
                    params={{
                        groupID: target.group_id,
                        userID: target.user_id,
                    }}
                >
                    <Button>View yourself</Button>
                </Link>
            )}
        </div>
    );
};

const TargetsList = ({ targets }: { targets: Tables<"tomato_target">[] }) => {
    return targets.map((target) => (
        <li key={target.id}>
            <Target target={target} />
        </li>
    ));
};

export default function GroupTodaysTargets({
    group,
}: {
    group: Tables<"group">;
}) {
    const { data, isError, isLoading } = useGetGroupTomatoes({
        groupID: group.id,
    });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <div className="absolute -top-6 right-0">
                <CountdownTimer
                    className="absolute right-0 top-3 text-muted-foreground text-xs"
                    expireDate={Date.parse(new Date().toISOString())}
                />
            </div>
            <div>
                {isError || (!data && <DataError message="" />)}

                {data?.length == 0 && (
                    <div className="flex justify-center text-muted-foreground flex-col items-center gap-2">
                        <h3>No targets today. You all did well yesterday.</h3>
                        {/* TODO : can break if section values change */}
                        <a href="#your-tasks-for-today-section">
                            <Button
                                size={"sm"}
                                variant={"outline"}
                                className="group"
                            >
                                <ArrowDown className="size-3 mr-2 group-hover:translate-y-0.5 transition-all" />
                                Your tasks today
                            </Button>
                        </a>
                    </div>
                )}

                <ul>
                    <TargetsList targets={data || []} />
                </ul>
            </div>
        </>
    );
}

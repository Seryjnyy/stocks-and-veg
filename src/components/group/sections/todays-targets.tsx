import DataError from "@/components/data-error";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetGroupTomatoTargets } from "@/hooks/supabase/group/use-get-group-tomato-targets";

import { Tables } from "@/lib/supabase/database.types";

import { ArrowDown } from "lucide-react";
import CountdownTimer from "../../countdown-timer";
import TomatoGroupUserButton from "../tomato-group-user-button";
import { Skeleton } from "../../ui/skeleton";
import GroupUserProfile from "../group-user-profile";
import { useGetGroupUser } from "@/hooks/supabase/group/use-get-group-user";
import WorkEnabledCountdownTimer from "../work-enabled-countdown-timer";

export default function TodaysTargets({ group }: { group: Tables<"group"> }) {
    const {
        data: tomatoTargets,
        isError,
        isLoading,
    } = useGetGroupTomatoTargets({
        groupID: group.id,
    });

    if (isLoading) {
        return <Loading />;
    }

    // TODO : add check if target is expired maybe, not necessary cause things get disabled, and maybe less confusing than things disappearing
    // This would be if data wasn't being deleted properly, as targets table should only hold
    // Add date to so its clear for what day they are getting punished
    return (
        <>
            <div className="absolute -top-0 right-0 flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                    {tomatoTargets?.length ?? 0}
                </span>
                <WorkEnabledCountdownTimer
                    withIcon={false}
                    className="border-l pl-2 "
                />
            </div>
            <div>
                {isError ||
                    (!tomatoTargets && (
                        <DataError message="Couldn't fetch targets." />
                    ))}

                {tomatoTargets?.length == 0 && (
                    <div className="flex justify-center text-muted-foreground flex-col items-center gap-2 ">
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

                <ul className="space-y-2">
                    <TargetList targets={tomatoTargets || []} />
                </ul>
            </div>
        </>
    );
}

const TargetList = ({ targets }: { targets: Tables<"tomato_target">[] }) => {
    return targets.map((target) => (
        <li key={target.id}>
            <Target target={target} />
        </li>
    ));
};

const Target = ({ target }: { target: Tables<"tomato_target"> }) => {
    // TODO: Error not handled
    const {
        data: groupUser,
        isError,
        isLoading,
    } = useGetGroupUser({
        groupID: target.group_id,
        userID: target.user_id,
    });

    return (
        <div className="flex justify-between items-center border rounded-lg  px-4 py-1 flex-wrap gap-2">
            {groupUser && (
                <GroupUserProfile
                    groupUser={groupUser}
                    viewMore
                    // variant={"dashed"}
                    usBadge
                    creatorBadge
                />
            )}
            {/* {isError || (!data && <GroupUserNotFound />)} */}
            {isLoading && <Skeleton className="w-[16rem] h-16" />}
            <div className="flex flex-row  items-center gap-2  p-2">
                <span className="text-sm text-muted-foreground">
                    Tomatoes received so far
                </span>
                <span className="text-lg font-bold">
                    {target.tomatoes_received}
                </span>
            </div>
            <TomatoGroupUserButton target={target} />
        </div>
    );
};

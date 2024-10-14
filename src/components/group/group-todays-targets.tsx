import DataError from "@/components/data-error";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";

import { Tables } from "@/lib/supabase/database.types";
import { useGetGroupTomatoes } from "@/lib/tomatoService";
import { ArrowDown } from "lucide-react";
import CountdownTimer from "../countdown-timer";
import TomatoGroupUserButton from "../tomato-group-user-button";
import { Skeleton } from "../ui/skeleton";
import GroupUserProfile from "./group-user-profile";
import GroupUserNotFound from "../errors";

const Target = ({ target }: { target: Tables<"tomato_target"> }) => {
    const { data, isError, isLoading } = useGetGroupUser({
        groupID: target.group_id,
        userID: target.user_id,
    });

    return (
        <div className="flex justify-between items-center border rounded-lg p-4 flex-wrap gap-2">
            {data && (
                <GroupUserProfile
                    groupUser={data}
                    viewMore
                    variant={"dashed"}
                />
            )}
            {isError || (!data && <GroupUserNotFound />)}
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
            <div className="absolute -top-0 right-0 space-x-2">
                <span className="text-muted-foreground text-xs">4</span>
                <CountdownTimer
                    className=" text-muted-foreground text-xs border-l pl-2"
                    expireDate={Date.parse(new Date().toISOString())}
                />
            </div>
            <div>
                {isError || (!data && <DataError message="" />)}

                {data?.length == 0 && (
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
                    <TargetsList targets={data || []} />
                </ul>
            </div>
        </>
    );
}

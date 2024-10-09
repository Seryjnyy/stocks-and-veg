import DataError from "@/components/data-error";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { useAuth } from "@/lib/hooks/use-auth";

import { Tables } from "@/lib/supabase/database.types";
import { useGetGroupTomatoes } from "@/lib/tomatoService";
import GroupUserProfile from "./group-user-profile";
import { TOMATO_EMOJI } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

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
    return targets.map((target) => <Target key={target.id} target={target} />);
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
        <div className="p-4  flex flex-col gap-2">
            <h3 className="text-4xl font-semibold text-center">
                Todays targets
            </h3>
            {isError || (!data && <DataError message="" />)}

            {data?.length == 0 && (
                <div>No targets today. You're all doing well today.</div>
            )}

            <ul>
                <TargetsList targets={data || []} />
            </ul>
        </div>
    );
}

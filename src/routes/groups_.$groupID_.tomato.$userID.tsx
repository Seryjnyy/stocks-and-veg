import { Button } from "@/components/ui/button";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { useAuth } from "@/lib/hooks/use-auth";
import supabase from "@/lib/supabase/supabaseClient";
import {
    useGetGroupUserTomato,
    useUpdateTomatoTarget,
} from "@/lib/tomatoService";
import { createFileRoute, Link } from "@tanstack/react-router";

// TODO : user can travel to this page through link, need to redirect or give message that they can't do it
export const Route = createFileRoute("/groups/$groupID/tomato/$userID")({
    component: Tomato,
});

const TomatoTarget = ({
    groupID,
    targetUserID,
}: {
    groupID: string;
    targetUserID: string;
    // onTomatoesThrown: () => void;
}) => {
    const { session } = useAuth();
    const { mutateAsync: throwTomato } = useUpdateTomatoTarget();
    const { data, isError, isLoading, refetch } = useGetGroupUserTomato({
        userID: targetUserID,
        groupID: groupID,
    });

    console.log(data);
    if (isError) {
        return <div>Can't throw tomatoes at them, something went wrong.</div>;
    }

    if (!data) {
        return <div>Can't throw tomatoes at them, they are doing well.</div>;
    }

    const handleThrowTomato = async () => {
        console.log(data);

        const { data: res, error: resError } = await supabase.rpc(
            "throw_tomatoes",
            {
                amount_to_throw: 5,
                throwing_user_id: session?.user.id ?? "",
                tomato_target_id: data.id,
            }
        );

        // refetch target data
        refetch();

        console.log(resError);
        console.log(res);
    };

    return (
        <div>
            <div className="border p-2 flex flex-col">
                <div>Target</div>
                <div>{data.user_id}</div>
                <div>{data.tomatoes_received}</div>
            </div>
            <Button onClick={handleThrowTomato}>Throw tomato</Button>
        </div>
    );
};

// TODO : need to check if unauthenticated users can reach here
// We can't tomato ourselves
// We can't tomato if target user doesn't deserve it
function Tomato() {
    const { groupID, userID } = Route.useParams();

    // check if user is part of group
    const { session } = useAuth();
    const {
        data: us,
        isError: isUsError,
        isLoading: isUsLoading,
    } = useGetGroupUser({
        groupID: groupID,
        userID: session?.user.id,
        enabled: !!session,
    });

    const {
        data: group,
        isError,
        isLoading,
    } = useGetGroup({
        groupID: groupID,
        enabled: !!session,
    });

    const {
        data: targetUser,
        isError: isTargetUserError,
        isLoading: isTargetUserLoading,
    } = useGetGroupUser({
        groupID: groupID,
        userID: userID,
        enabled: !!session,
    });

    const groupUserUs = us && us.length > 0 ? us[0] : undefined;
    const groupUserTarget =
        targetUser && targetUser.length > 0 ? targetUser[0] : undefined;

    if (isUsError || !groupUserTarget || !groupUserTarget) {
        // Can't do anything if we are not part of group
        return null;
    }

    const isWeTryingToTomatoOurself =
        !groupUserTarget ||
        !groupUserUs ||
        groupUserTarget.user_id == groupUserUs.user_id;

    return (
        <div>
            <div>{group?.name}</div>
            <div>{groupUserUs?.profile?.username}</div>
            <div>
                <div>target</div>
                <div>{groupUserTarget?.profile?.username}</div>
            </div>
            <div>
                {isWeTryingToTomatoOurself ? (
                    <div>
                        <span>
                            "Don't be so tough on yourself, you're doing good."
                        </span>
                        <span className="text-xs text-muted-foreground">
                            You can't throw tomatoes at yourself.
                        </span>
                        <Link
                            to="/groups/$groupID"
                            params={{ groupID: groupID }}
                        >
                            <Button>Back to group</Button>
                        </Link>
                    </div>
                ) : (
                    // <TomatoTarget groupID={groupID} targetUserID={userID} />
                    <>shoot them</>
                )}
            </div>
            <div className="border p-4">
                <TomatoTarget
                    groupID={groupID}
                    targetUserID={userID}
                    // onTomatoesThrown={}
                />
            </div>

            <div className="flex flex-col border p-3">
                <div>Your tomatoes</div>
                {us && <div>{`${groupUserUs?.tomatoes}`}count</div>}
            </div>
        </div>
    );
}

import { Button } from "@/components/ui/button";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { useAuth } from "@/hooks/use-auth";
import supabase from "@/lib/supabase/supabaseClient";
import {
    useGetGroupUserTomato,
    useUpdateTomatoTarget,
} from "@/lib/tomatoService";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Test } from "./test";

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
        data: currentUser,
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

    if (isUsError || !targetUser || !currentUser) {
        // Can't do anything if we are not part of group
        return null;
    }

    const areWeTheTarget = targetUser.user_id == currentUser?.user_id;

    return (
        <div>
            {/* <div className="p-3">
                <div className="border p-2">
                    Group data
                    <div>
                        Group name ---
                        {group?.name}
                    </div>
                    <div>
                        Group ID ---
                        {group?.id}
                    </div>
                </div>

                <div className="border p-2">
                    Us data
                    <div>username ----- {currentUser?.profile?.username}</div>
                    <div>user id ----- {currentUser?.user_id}</div>
                </div>

                <div className="border p-2">
                    <div>target</div>
                    <div>username ---- {targetUser?.profile?.username}</div>
                    <div>user id ---- {targetUser?.user_id}</div>
                </div>
                <div className="border p-2">
                    Are we the target {areWeTheTarget ? "yes" : "no"}
                </div>

                <div className="border p-4">
                    <TomatoTarget
                        groupID={groupID}
                        targetUserID={userID}
                        // onTomatoesThrown={}
                    />
                </div>
            </div> */}

            {/* <div className="flex flex-col border p-3">
                <div>Your tomatoes</div>
                {currentUser && <div>{`${currentUser?.tomatoes}`}count</div>}
            </div> */}
            <Test targetUser={targetUser} currentUser={currentUser} />
        </div>
    );
}

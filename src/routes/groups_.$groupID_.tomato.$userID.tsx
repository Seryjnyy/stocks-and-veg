import { Button } from "@/components/ui/button";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { useAuth } from "@/lib/hooks/use-auth";
import { createFileRoute } from "@tanstack/react-router";

// TODO : user can travel to this page through link, need to redirect or give message that they can't do it
export const Route = createFileRoute("/groups/$groupID/tomato/$userID")({
    component: Tomato,
});

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
                        <Button>Back to group</Button>
                    </div>
                ) : (
                    "Chuck em mateas."
                )}
            </div>

            <div className="flex flex-col border p-3">
                <div>Your tomatoes</div>
                {us && <div>{`${groupUserUs?.tomatoes}`}count</div>}
            </div>
        </div>
    );
}

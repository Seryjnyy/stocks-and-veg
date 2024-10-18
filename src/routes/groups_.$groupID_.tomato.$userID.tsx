import { useAuth } from "@/hooks/use-auth";
import { useGetGroupUser } from "@/hooks/supabase/group/use-get-group-user";
import { createFileRoute } from "@tanstack/react-router";
import { TomatoLiveRoom } from "../components/group/tomato-live/tomato-live-room";
import DataError from "@/components/data-error";
import Loading from "@/components/loading";

// TODO : user can travel to this page through link, need to redirect or give message that they can't do it
export const Route = createFileRoute("/groups/$groupID/tomato/$userID")({
    component: TomatoRoom,
});

// TODO : need to check if unauthenticated users can reach here
function TomatoRoom() {
    const { groupID, userID } = Route.useParams();

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
        data: targetUser,
        isError: isTargetUserError,
        isLoading: isTargetUserLoading,
    } = useGetGroupUser({
        groupID: groupID,
        userID: userID,
        enabled: !!session,
    });

    if (isUsLoading || isTargetUserLoading) {
        return <Loading variant={"page"} />;
    }

    if (isTargetUserError || isUsError) {
        return <DataError message="Failed to fetch required data." />;
    }

    if (!targetUser || !currentUser) {
        return null;
    }

    return <TomatoLiveRoom targetUser={targetUser} currentUser={currentUser} />;
}

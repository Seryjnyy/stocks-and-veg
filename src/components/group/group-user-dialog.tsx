import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { GroupUserWithProfile } from "@/lib/hooks/queries/use-get-group-users";
import { useAuth } from "@/lib/hooks/use-auth";
import SpinnerButton from "@/spinner-button";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@tanstack/react-router";

export default function GroupUserDialog({
    groupUser,
}: {
    groupUser: GroupUserWithProfile;
}) {
    const { session } = useAuth();
    const { data, isLoading } = useGetGroup({
        groupID: groupUser.group_id,
        enabled: !!session,
    });
    const navigate = useNavigate();

    const isUserCreator = session
        ? data?.creator_id == session?.user.id
        : false;

    const handleRemoveUser = () => {
        console.error("Not implemented");
    };

    // TODO : Check if can be tomated, check if not us
    const isAbleToBeTomatoed = true;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"sm"}>
                    <EyeOpenIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="sr-only">Group user</DialogTitle>
                    <DialogDescription className="sr-only">
                        View some more details about this user.
                    </DialogDescription>
                </DialogHeader>

                <div className="border p-2 flex items-end gap-4 flex-wrap">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <div>
                        <div>{groupUser.profile?.username}</div>
                        <div>joined at {groupUser.created_at}</div>
                    </div>
                    {isUserCreator && (
                        <SpinnerButton
                            size={"sm"}
                            variant={"destructive"}
                            isPending={isLoading}
                            disabled={isLoading}
                            onClick={handleRemoveUser}
                        >
                            Remove user
                        </SpinnerButton>
                    )}
                </div>

                <div>More stats</div>
                <div>Total tasks</div>
                <div>Completed tasks today</div>
                <div>Not completed tasks today</div>
                <div>Tomates count</div>
                <div>level</div>
                <div>days completed</div>
                <div>days paritally completed (more than 50%) </div>
                <div>times tomatoed</div>
                <div>biggest tomatoed count</div>
                <DialogFooter>
                    <Button
                        className="w-full"
                        disabled={!isAbleToBeTomatoed}
                        onClick={() => {
                            if (!isAbleToBeTomatoed) return;
                            navigate({
                                to: "/groups/$groupID/tomato/$userID",
                                params: {
                                    groupID: groupUser.group_id,
                                    userID: groupUser.user_id,
                                },
                            });
                        }}
                    >
                        Tomatoe them
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

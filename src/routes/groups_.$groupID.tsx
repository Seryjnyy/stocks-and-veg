import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DataError from "@/components/data-error";
import GroupTasks from "@/components/group/group-tasks";
import GroupUserDialog from "@/components/group/group-user-dialog";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CONFIG } from "@/lib/config";
import { useCreateInviteLink } from "@/lib/hooks/mutations/use-create-invite-link";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import {
    GroupUserWithProfile,
    useGetGroupUsers,
} from "@/lib/hooks/queries/use-get-group-users";
import { useGetInviteLink } from "@/lib/hooks/queries/use-get-invite-link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { formatInviteLink } from "@/lib/utils";
import SpinnerButton from "@/spinner-button";
import { CopyIcon, PersonIcon } from "@radix-ui/react-icons";

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CrownIcon, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tables } from "@/lib/supabase/database.types";
import { Label } from "@/components/ui/label";
import { useGetGroupTomatoes } from "@/lib/tomatoService";
import GroupTodaysTargets from "@/components/group/group-todays-targets";
import GroupUserProfile from "@/components/group/group-user-profile";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";

export const Route = createFileRoute("/groups/$groupID")({
    component: Group,
});

const GroupUser = ({ user }: { user: GroupUserWithProfile }) => {
    const { session } = useAuth();
    const { data } = useGetGroup({ groupID: user.group_id });

    const isUs = session?.user.id == user.user_id;

    const isCreator = data && data.creator_id == user.user_id;

    return (
        <div className="w-full p-4 border rounded-sm flex flex-col">
            <span>{user.profile?.username}</span>
            <span>{user.profile?.user_id}</span>
            <div>
                <span>
                    {isUs ? (
                        <Badge>
                            <User2 className="size-3" />
                        </Badge>
                    ) : null}
                </span>
                <span>
                    {isCreator ? (
                        <Badge>
                            <CrownIcon className="size-3" />
                        </Badge>
                    ) : null}
                </span>
            </div>
            <GroupUserDialog groupUser={user} />
        </div>
    );
};

const GroupUsersList = ({ users }: { users: GroupUserWithProfile[] }) => {
    return users.map((user) => (
        <GroupUserProfile
            groupUser={user}
            key={user.id}
            className="w-full p-6"
        />
    ));
};

const GroupUsers = ({ groupID }: { groupID: string }) => {
    const { data, error } = useGetGroupUsers({
        groupID: groupID,
    });

    if (error) {
        return <div>error</div>;
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <h3 className="text-3xl font-semibold text-center">Group users</h3>
            <ul className="flex flex-col gap-4">
                <GroupUsersList users={data || []} />
            </ul>
            <span>
                {(data || []).length}/{CONFIG.maxGroupUsers}
            </span>
        </div>
    );
};

// TODO : error unhandled
const Invite = ({ groupID }: { groupID: string }) => {
    const { data, isError, isLoading } = useGetInviteLink({ groupID: groupID });
    const { mutateAsync: createInviteLink, isPending } = useCreateInviteLink();
    const { toast } = useToast();
    const [copiedText, copy] = useCopyToClipboard();

    const handleCopy = (text: string) => {
        copy(text)
            .then(() => {
                toast({
                    title: "Successfully copied invite link.",
                });
            })
            .catch((error) => {
                toast({
                    title: "Failed to copy invite link.",
                    variant: "destructive",
                });
            });
    };

    const handleGenerateLink = () => {
        createInviteLink(
            [
                {
                    id: data?.id ?? undefined,
                    group_id: groupID,
                    token: "",
                    expires_at: new Date().toISOString(),
                },
            ],
            {
                onSuccess: () => {
                    toast({
                        title: "Successfully generated invite link.",
                        description:
                            "Invite link was copied to your clipboard.",
                    });
                },
                onError: () => {
                    toast({
                        title: "Failed to generate invite link.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    const isInviteLinkExpired = data
        ? new Date() > new Date(data.expires_at)
        : false;

    return (
        <div className="p-4 border">
            <h3 className="text-xl">Invite</h3>

            <div className="border p-2">
                <p className="text-sm text-muted-foreground pb-4">
                    Get a invite link and share it with your friend. They can
                    visit the link to join this group. Invite links are valid
                    for a day.
                </p>
                <div className="border p-2">
                    <code>{data && formatInviteLink(data?.token)}</code>
                </div>
                <div>
                    <div className="flex items-center gap-4">
                        <SpinnerButton
                            onClick={handleGenerateLink}
                            isPending={isPending || isLoading}
                            disabled={isLoading}
                        >
                            Generate new invite link
                        </SpinnerButton>

                        <Button
                            size={"icon"}
                            disabled={
                                data == null || isInviteLinkExpired || isLoading
                            }
                            onClick={() => {
                                if (data) {
                                    handleCopy(formatInviteLink(data?.token));
                                }
                            }}
                        >
                            <CopyIcon />
                        </Button>
                    </div>
                    {isInviteLinkExpired && (
                        <div className="text-xs text-muted-foreground">
                            Old invite link has expired. Please generate a new
                            one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const GroupManage = ({ group }: { group: Tables<"group"> }) => {
    const handleDeleteData = () => {};

    const [groupName, setGroupName] = useState("");

    return (
        <div className="border p-4 flex flex-col space-y-2">
            <h3>Manage group</h3>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete group</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this group?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this group along with all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="mt-12">
                        <Label
                            htmlFor="confirm-delete-input"
                            className="font-normal"
                        >
                            Please type{" "}
                            <span className="font-bold">{group.name}</span> to
                            confirm.
                        </Label>
                        <Input
                            id="confirm-delete-input"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteData}
                            disabled={groupName != group.name}
                            className="text-destructive"
                        >
                            Delete Data
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button>Reset stats (remove stats data) </Button>
            <Button>Reset tasks (remove tasks)</Button>
        </div>
    );
};

// TODO : is it better to drill stuff like session, or let components use useAuth hook?
function Group() {
    const { groupID } = Route.useParams();
    const { session } = useAuth();
    const { data, error, isLoading } = useGetGroup({
        enabled: !!session,
        groupID: groupID,
    });

    const { data: groupUser } = useGetGroupUser({
        groupID: groupID,
        userID: session?.user.id,
        enabled: !!session,
    });

    if (error) {
        return <DataError message={error.message} />;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (data == null) {
        return <DataError message="Group data is missing." />;
    }

    const isCreator = session && data && session.user.id == data.creator_id;
    return (
        <div>
            <div className="border min-w-[14rem] fixed top-10 bg-secondary/25 h-screen flex flex-col items-stretch ">
                <div className="bg-gradient-to-br from-purple-500 to-emerald-400 w-full h-[5rem] opacity-45"></div>
                <div>
                    <ul>
                        <li>Todays targets</li>
                        <li>Your tasks today</li>
                        <li>Other user tasks</li>
                        <li>Group users</li>
                        <li>Invite</li>
                        <li>Manage group</li>
                    </ul>
                </div>
                {groupUser && <GroupUserProfile groupUser={groupUser} small />}
            </div>
            <div className="pr-12 py-20 space-y-8 pl-[17rem]">
                <h1 className="font-bold text-5xl">
                    {data.name}
                    <Badge>
                        <CrownIcon className="size-3" />
                    </Badge>
                </h1>
                <div className="space-y-[16rem]">
                    <GroupTodaysTargets group={data} />
                    <GroupTasks groupID={groupID} />
                    <GroupUsers groupID={groupID} />
                    <Invite groupID={groupID} />
                    {isCreator && <GroupManage group={data} />}
                </div>
            </div>
        </div>
    );
}

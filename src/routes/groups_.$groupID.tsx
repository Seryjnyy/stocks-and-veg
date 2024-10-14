import DataError from "@/components/data-error";
import Loading from "@/components/loading";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useToast } from "@/hooks/use-toast";
import { CONFIG } from "@/lib/config";
import { useCreateInviteLink } from "@/lib/hooks/mutations/use-create-invite-link";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import {
    GroupUserWithProfile,
    useGetGroupUsers,
} from "@/lib/hooks/queries/use-get-group-users";
import { useGetInviteLink } from "@/lib/hooks/queries/use-get-invite-link";
import { formatInviteLink } from "@/lib/utils";
import SpinnerButton from "@/spinner-button";
import { GearIcon } from "@radix-ui/react-icons";

import GroupOtherUsersTasks from "@/components/group/group-other-users-tasks";
import GroupTodaysTargets from "@/components/group/group-todays-targets";
import GroupUserProfile from "@/components/group/group-user-profile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
    CheckCheckIcon,
    CheckSquare,
    Copy,
    CrownIcon,
    RefreshCw,
    Target,
    Trash2,
    UserPlus,
    Users,
} from "lucide-react";
import { useState } from "react";

import BackButton from "@/components/back-button";

import GroupYourTasksToday from "@/components/group/group-your-tasks-today";
import Sidebar from "@/components/group/sidebar";
import { useDeleteGroup } from "@/lib/hooks/mutations/use-delete-group";
import { GroupSection as GroupSectionType } from "@/lib/types";
import GroupSection from "@/components/group/group-section";

export const Route = createFileRoute("/groups/$groupID")({
    component: GroupTwo,
});

const GroupUsersList = ({ users }: { users: GroupUserWithProfile[] }) => {
    return users.map((user) => (
        <GroupUserProfile
            groupUser={user}
            key={user.id}
            progressBar={true}
            usBadge
            creatorBadge
            viewMore
            variant="dashed"
            detailSize={"2xl"}
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
        <>
            <span className="absolute -top-6 right-0 text-xs text-muted-foreground">
                {(data || []).length}/{CONFIG.maxGroupUsers}
            </span>
            <div>
                <ul className="flex  gap-2 flex-wrap">
                    <GroupUsersList users={data || []} />
                </ul>
            </div>
        </>
    );
};

// TODO : error unhandled

export default function InviteSection({ groupID }: { groupID: string }) {
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
        <>
            {data && (
                <Badge
                    className="absolute -top-8 right-0"
                    variant={isInviteLinkExpired ? "destructive" : "secondary"}
                >
                    {isInviteLinkExpired ? "Expired" : "Active"}
                </Badge>
            )}
            <Card className="w-full border-none">
                <CardContent>
                    <div className="space-y-4">
                        {data ? (
                            <div className="flex items-center space-x-2">
                                <code
                                    className={cn(
                                        "flex-1 p-2 bg-muted rounded text-sm break-all",
                                        {
                                            "select-none text-muted-foreground/50":
                                                isInviteLinkExpired,
                                        }
                                    )}
                                >
                                    {formatInviteLink(data?.token)}
                                </code>
                                <Button
                                    size="icon"
                                    onClick={() => {
                                        if (data) {
                                            handleCopy(
                                                formatInviteLink(data?.token)
                                            );
                                        }
                                    }}
                                    disabled={
                                        data == null ||
                                        isInviteLinkExpired ||
                                        isLoading ||
                                        isPending
                                    }
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">
                                No active invite link
                            </p>
                        )}
                        <SpinnerButton
                            isPending={isPending}
                            disabled={isPending || isLoading}
                            onClick={handleGenerateLink}
                            className="w-full"
                            variant={
                                data && !isInviteLinkExpired
                                    ? "outline"
                                    : "default"
                            }
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {data ? "Generate New Link" : "Create Invite Link"}
                        </SpinnerButton>
                        <p className="text-sm text-muted-foreground">
                            Get a invite link and share it with your friend.
                            They can visit the link to join this group. Invite
                            links are valid for a day.
                            {isInviteLinkExpired &&
                                " The current link is expired. Please generate a new one."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

const GroupManage = ({ group }: { group: Tables<"group"> }) => {
    const { mutateAsync: deleteGroup } = useDeleteGroup();

    const { toast } = useToast();
    const navigate = useNavigate();

    const handleDeleteData = async () => {
        await deleteGroup(
            { id: group.id },
            {
                onSuccess: () => {
                    // TODO : both of these don't work
                    toast({
                        title: "Successfully deleted group.",
                    });
                },
                onError: () => {
                    toast({
                        title: "Failed to delete group.",
                        variant: "destructive",
                    });
                },
            }
        );

        navigate({
            to: "/groups",
        });
    };

    const [groupName, setGroupName] = useState("");

    return (
        <div>
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
                            className={buttonVariants({
                                variant: "destructive",
                            })}
                        >
                            <Trash2 className="size-3 mr-2" /> Delete Data
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
function GroupTwo() {
    const { groupID } = Route.useParams();
    const { session } = useAuth();
    const { data, error, isLoading } = useGetGroup({
        enabled: !!session,
        groupID: groupID,
    });

    if (error) {
        return (
            <div className="flex justify-center items-center px-12  py-12">
                <DataError message={error.message} />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center px-12  py-12">
                <Loading />
            </div>
        );
    }

    if (data == null) {
        return (
            <div className="flex justify-center  px-12  py-12 flex-col gap-4">
                <Link to="/groups" className="w-fit">
                    <BackButton />
                </Link>
                <DataError message="Group data is missing." />
            </div>
        );
    }

    const sections: GroupSectionType[] = [
        {
            icon: Target,
            label: "Todays targets",
            value: "todays-targets-section",
            section: <GroupTodaysTargets group={data} />,
        },
        {
            icon: CheckSquare,
            label: "Your tasks for today",
            value: "your-tasks-for-today-section",
            section: <GroupYourTasksToday groupID={groupID} />,
        },
        {
            icon: CheckCheckIcon,
            label: "Other user tasks",
            value: "other-user-tasks-section",
            section: <GroupOtherUsersTasks groupID={groupID} />,
        },
        {
            icon: Users,
            label: "Group users",
            value: "group-users-section",
            section: <GroupUsers groupID={groupID} />,
        },
        {
            icon: UserPlus,
            label: "Invite",
            value: "invite-section",
            section: <InviteSection groupID={groupID} />,
        },
        {
            icon: GearIcon,
            label: "Manage group",
            value: "manage-group-section",
            section: <GroupManage group={data} />,
        },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-4.1rem)] overflow-hidden">
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar groupID={groupID} sections={sections} />
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto relative">
                    {/* Shadow thingy so looks like components disappearing into void */}
                    {/* <div className="w-full h-[5rem] sticky top-0 bg-gradient-to-b  from-background to-transparent"></div> */}
                    <h1 className="font-bold text-7xl text-center text-muted-foreground mb-32 mt-10">
                        {data.name}
                        <Badge className="bg-muted-foreground">
                            <CrownIcon className="size-3" />
                        </Badge>
                    </h1>
                    <div className="space-y-[30rem]">
                        {sections.map((section) => (
                            <GroupSection
                                sectionData={{
                                    label: section.label,
                                    value: section.value,
                                }}
                            >
                                {section.section}
                            </GroupSection>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

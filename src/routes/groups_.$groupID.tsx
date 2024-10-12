import DataError from "@/components/data-error";
import GroupUserDialog from "@/components/group/group-user-dialog";
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
import GroupUserProfile, {
    GroupUserAvatar,
} from "@/components/group/group-user-profile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
    CheckCheckIcon,
    CheckSquare,
    Copy,
    CrownIcon,
    RefreshCw,
    SidebarClose,
    SidebarOpen,
    Target,
    Trash2,
    UserPlus,
    Users,
} from "lucide-react";
import { useState } from "react";

import GroupSection from "@/components/group/group-section";
import GroupYourTasksToday from "@/components/group/group-your-tasks-today";
import { currentSectionInGroupPageAtom } from "@/lib/atoms/current-section-group-page";
import { useAtom } from "jotai";
import { useDeleteGroup } from "@/lib/hooks/mutations/use-delete-group";
import BackButton from "@/components/back-button";
import { useGetUserGroups } from "@/lib/hooks/queries/use-get-user-groups";
import CountdownTimer from "@/components/countdown-timer";

export const Route = createFileRoute("/groups/$groupID")({
    component: GroupTwo,
});

const GroupUsersList = ({ users }: { users: GroupUserWithProfile[] }) => {
    return users.map((user) => (
        <GroupUserProfile groupUser={user} key={user.id} usBadge creatorBadge />
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
        return (
            <div className="flex justify-center items-center px-12 bg-red-400">
                <DataError message="Group data is missing." />
            </div>
        );
    }

    const isCreator = session && data && session.user.id == data.creator_id;

    const links = [
        {
            label: <span>Todays targets</span>,
            value: "todays-targets-section",
            link: "#todays-targets-section",
        },
        {
            label: <span>Your tasks for today</span>,
            value: "your-tasks-for-today-section",
            link: "#your-tasks-for-today-section",
        },
        {
            label: <span>Other user tasks</span>,
            value: "other-user-tasks-section",
            link: "#other-user-tasks-section",
        },
        {
            label: <span>Group users</span>,
            value: "group-users-section",
            link: "#group-users-section",
        },
        {
            label: <span>Invite</span>,
            value: "invite-section",
            link: "#invite-section",
        },
        {
            label: <span>Manage group</span>,
            value: "manage-group-section",
            link: "#manage-group-section",
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className="border min-w-[14rem]  bg-secondary/25  flex flex-col  transition-all">
                {/* <div className="bg-gradient-to-br from-purple-500 to-emerald-400 w-full h-[10rem] opacity-45"></div> */}

                <nav className="h-full">
                    <ul className="px-1 py-1 ">
                        {links.map((link, index) => (
                            <li key={index}>
                                <a href={link.link}>
                                    <Button
                                        className="w-full flex justify-start"
                                        variant={"outline"}
                                    >
                                        {link.label}
                                    </Button>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {groupUser && (
                    <GroupUserProfile
                        groupUser={groupUser}
                        small
                        className="border-none"
                    />
                )}
            </aside>
            {/* <div className="pr-12 py-20 space-y-8 pl-[17rem]">
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
            </div> */}
        </div>
    );
}

function GroupTwo() {
    const [expanded, setExpanded] = useState(true);
    const { groupID } = Route.useParams();
    const { session } = useAuth();
    const { data, error, isLoading } = useGetGroup({
        enabled: !!session,
        groupID: groupID,
    });

    // TODO : well don't need jotai rn, but If at some point sidebar is split it could be useful -\o/-
    const [currentSection, setCurrentSection] = useAtom(
        currentSectionInGroupPageAtom
    );

    const { data: groupUser } = useGetGroupUser({
        groupID: groupID,
        userID: session?.user.id,
        enabled: !!session,
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
            <div className="flex justify-center  px-12  py-12 flex flex-col gap-4">
                <Link to="/groups" className="w-fit">
                    <BackButton />
                </Link>
                <DataError message="Group data is missing." />
            </div>
        );
    }

    const isCreator = session && data && session.user.id == data.creator_id;

    const sections = [
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
            <div className="flex flex-1 overflow-hidden ">
                {/* Sidebar */}
                <aside
                    className={cn(
                        " border-r  transition-all z-50 bg-[#0f0f10]",
                        expanded ? "w-64" : "w-20"
                    )}
                >
                    <nav className="h-full flex flex-col">
                        <div className="p-4 pb-2 flex justify-between items-center border-b">
                            <Button
                                variant="outline"
                                className="p-2 w-full"
                                onClick={() => setExpanded((curr) => !curr)}
                            >
                                <span>
                                    {expanded ? (
                                        <SidebarClose />
                                    ) : (
                                        <SidebarOpen />
                                    )}
                                </span>
                            </Button>
                        </div>

                        {/* <div
                            className={cn(
                                "bg-gradient-to-r from-sky-500 to-indigo-500 overflow-hidden transition-all w-full",
                                expanded ? "h-[120px]" : "h-[50px]"
                            )}
                        /> */}

                        <ul className="flex-1 px-3 mt-12">
                            {sections.map((item, index) => (
                                <li key={index}>
                                    <a href={`#${item.value}`}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group w-full",
                                                expanded
                                                    ? "justify-start"
                                                    : "justify-center"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "w-5 h-5",
                                                    expanded && "mr-2",
                                                    currentSection ==
                                                        item.value &&
                                                        "text-blue-500"
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    expanded
                                                        ? "opacity-100"
                                                        : "opacity-0 overflow-hidden w-0",
                                                    "transition-all"
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                            {!expanded && (
                                                <div
                                                    className={cn(
                                                        "absolute left-full rounded-md px-2 py-1 ml-6",
                                                        "bg-indigo-100 text-indigo-800 text-sm",
                                                        "invisible opacity-20 -translate-x-3 transition-all",
                                                        "group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
                                                    )}
                                                >
                                                    {item.label}
                                                </div>
                                            )}
                                        </Button>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col items-center justify-center py-4">
                            <span
                                className={cn(
                                    "text-muted-foreground text-xs transition-all opacity-0 w-0",
                                    expanded && "opacity-100 w-fit delay-200"
                                )}
                            >
                                {expanded &&
                                    "Time remaining today to do tasks."}
                            </span>
                            <CountdownTimer
                                className=" text-blue-400 text-xs"
                                expireDate={Date.parse(
                                    new Date().toISOString()
                                )}
                            />
                        </div>
                        <div className="border-t flex p-3  ">
                            <div
                                className={cn(
                                    "flex items-center   w-full",
                                    expanded
                                        ? "w-full justify-between cursor-auto"
                                        : "justify-center cursor-pointer"
                                )}
                                onClick={() => {
                                    !expanded && setExpanded(true);
                                }}
                            >
                                <div
                                    className={cn(
                                        "flex items-center ",
                                        expanded && "gap-3"
                                    )}
                                >
                                    {groupUser && (
                                        <div className="flex items-center justify-between w-full gap-5 h-full relative">
                                            <GroupUserAvatar
                                                groupUser={groupUser}
                                                creatorBadge
                                            />

                                            <div
                                                className={cn(
                                                    "flex items-center w-full overflow-hidden transition-opacity duration-200 gap-5",
                                                    expanded
                                                        ? "w-full opacity-100"
                                                        : "w-0 absolute  opacity-0"
                                                )}
                                            >
                                                {expanded && (
                                                    <>
                                                        <div className="flex flex-col">
                                                            <span className="truncate max-w-[7rem] min-w-[7rem] inline-block">
                                                                {
                                                                    groupUser
                                                                        .profile
                                                                        ?.username
                                                                }
                                                            </span>
                                                            <span className="text-xs text-muted-foreground truncate max-w-[7rem] min-w-[7rem] inline-block">
                                                                {
                                                                    groupUser.user_id.split(
                                                                        "-"
                                                                    )[0]
                                                                }
                                                            </span>
                                                        </div>
                                                        <GroupUserDialog
                                                            groupUser={
                                                                groupUser
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                </aside>

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

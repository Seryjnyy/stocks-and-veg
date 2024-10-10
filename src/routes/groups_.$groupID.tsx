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
import { formatInviteLink, TOMATO_EMOJI } from "@/lib/utils";
import SpinnerButton from "@/spinner-button";
import { CopyIcon, GearIcon } from "@radix-ui/react-icons";

import GroupUserProfile from "@/components/group/group-user-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
    Bell,
    CheckCheckIcon,
    CheckSquare,
    ChevronFirst,
    ChevronLast,
    Copy,
    CrownIcon,
    LayoutDashboard,
    Menu,
    RefreshCw,
    Search,
    SidebarClose,
    SidebarOpen,
    Target,
    User2,
    UserPlus,
    Users,
} from "lucide-react";
import { useState } from "react";
import GroupTodaysTargets from "@/components/group/group-todays-targets";
import GroupOtherUsersTasks from "@/components/group/group-other-users-tasks";

import { User, LogOut } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { InView } from "react-intersection-observer";
import { useAtom } from "jotai";
import { currentSectionInGroupPageAtom } from "@/lib/atoms/current-section-group-page";
import GroupYourTasksToday from "@/components/group/group-your-tasks-today";
import GroupSection from "@/components/group/group-section";

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
        <Card className="w-full border-none">
            <CardHeader>
                <CardTitle
                    className="flex items-center justify-center relative text-4xl font-semibold "
                    id={"invite-section"}
                >
                    Invite Link
                    {data && (
                        <Badge
                            className="absolute top-4 right-0"
                            variant={
                                isInviteLinkExpired
                                    ? "destructive"
                                    : "secondary"
                            }
                        >
                            {isInviteLinkExpired ? "Expired" : "Active"}
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
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
                            data && !isInviteLinkExpired ? "outline" : "default"
                        }
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {data ? "Generate New Link" : "Create Invite Link"}
                    </SpinnerButton>
                    <p className="text-sm text-muted-foreground">
                        Get a invite link and share it with your friend. They
                        can visit the link to join this group. Invite links are
                        valid for a day.
                        {isInviteLinkExpired &&
                            " The current link is expired. Please generate a new one."}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

const GroupManage = ({ group }: { group: Tables<"group"> }) => {
    const handleDeleteData = () => {};

    const [groupName, setGroupName] = useState("");

    return (
        <div className="border p-4 flex flex-col space-y-2">
            <h3
                className="text-4xl font-semibold text-center"
                id={"manage-group-section"}
            >
                Manage group
            </h3>
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
        return <DataError message={error.message} />;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (data == null) {
        return <DataError message="Group data is missing." />;
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
            link: "#invite-section",
        },
        // {
        //     icon: GearIcon,
        //     label: "Manage group",
        //     link: "#manage-group-section",
        // },
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Navbar */}
            <header className=" ">
                {/* <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="mr-2">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-8 w-64"
                            />
                        </div>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Avatar>
                            <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="User"
                            />
                            <AvatarFallback className="bg-red-400"></AvatarFallback>
                        </Avatar>
                    </div>
                </div> */}
                <Navbar />
            </header>

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

                        <div className="border-t flex p-3 ">
                            <div
                                className={cn(
                                    "flex items-center cursor-pointer  w-full",
                                    expanded
                                        ? "w-full justify-between"
                                        : "justify-center"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex items-center ",
                                        expanded && "gap-3"
                                    )}
                                >
                                    <Avatar className="rounded-none ">
                                        <AvatarImage
                                            src="/placeholder.svg?height=32&width=32"
                                            alt="User"
                                        />
                                        <AvatarFallback className="bg-red-500"></AvatarFallback>
                                    </Avatar>
                                    {/* {expanded && (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {
                                                            groupUser?.profile
                                                                ?.username
                                                        }
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {
                                                            groupUser?.user_id.split(
                                                                "-"
                                                            )[0]
                                                        }
                                                    </span>
                                                </div>
                                            )} */}
                                </div>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto  p-8">
                    <div className="py-20 space-y-8 ">
                        <h1 className="font-bold text-5xl">
                            {data.name}
                            <Badge>
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

                            {/* <GroupYourTasksToday groupID={groupID} /> */}

                            {/* <InView
                                // className="bg-green-300"
                                onChange={(val) =>
                                    onInView("#other-user-tasks-section", val)
                                }
                            >
                                <GroupOtherUsersTasks groupID={groupID} />
                            </InView>
                            <InView
                                // className="bg-purple-300"
                                onChange={(val) =>
                                    onInView("#group-users-section", val)
                                }
                            >
                                <GroupUsers groupID={groupID} />
                            </InView>
                            {isCreator && (
                                <InView
                                    // className="bg-yellow-300"
                                    onChange={(val) =>
                                        onInView("#invite-section", val)
                                    }
                                >
                                    <InviteSection groupID={groupID} />
                                </InView>
                            )}

                            {isCreator && (
                                <InView
                                    // className="bg-gray-600"
                                    onChange={(val) =>
                                        onInView("#manage-group-section", val)
                                    }
                                >
                                    <GroupManage group={data} />
                                </InView>
                            )} */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // This would normally come from your auth state
    const username = "JohnDoe"; // This would normally come from your user state

    return (
        <nav className="border-b bg-[#0f0f10]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <a
                            href="/"
                            className="flex-shrink-0 flex items-center border-x justify-center "
                        >
                            <span className="h-8 w-8 flex justify-center items-center ">
                                {TOMATO_EMOJI}
                            </span>
                        </a>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a
                                href="/groups"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-foreground hover:border-foreground/50 hover:text-foreground/50"
                            >
                                Groups
                            </a>
                        </div>
                    </div>
                    {/* <div className="flex items-center text-muted-foreground font-bold">
                        <span>some group</span>
                    </div> */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="ml-3 relative"
                                    >
                                        <Avatar className="size-6">
                                            <AvatarImage
                                                src="/placeholder.svg?height=32&width=32"
                                                alt={username}
                                            />
                                            <AvatarFallback className="bg-red-400"></AvatarFallback>
                                        </Avatar>
                                        <span className="ml-2">
                                            {"test@test.com"}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setIsLoggedIn(false)}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsLoggedIn(true)}
                                >
                                    Log in
                                </Button>
                                <Button className="ml-3">Sign up</Button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center sm:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                >
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    <Menu
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <div className="pt-5 pb-6 px-5">
                                    <div className="mt-6">
                                        <nav className="grid gap-y-8">
                                            <a
                                                href="/groups"
                                                className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                                            >
                                                <span className="ml-3 text-base font-medium text-gray-900">
                                                    Groups
                                                </span>
                                            </a>
                                        </nav>
                                    </div>
                                </div>
                                <div className="py-6 px-5 space-y-6">
                                    {isLoggedIn ? (
                                        <div className="space-y-6">
                                            <span className="text-base font-medium text-gray-900">
                                                {username}
                                            </span>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                asChild
                                            >
                                                <a href="/profile">Profile</a>
                                            </Button>
                                            <Button
                                                className="w-full"
                                                onClick={() =>
                                                    setIsLoggedIn(false)
                                                }
                                            >
                                                Log out
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Button
                                                className="w-full"
                                                onClick={() =>
                                                    setIsLoggedIn(true)
                                                }
                                            >
                                                Log in
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="mt-3 w-full"
                                            >
                                                Sign up
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

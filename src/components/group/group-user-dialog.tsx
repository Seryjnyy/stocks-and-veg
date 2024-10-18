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
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { useGetGroupUserTasks } from "@/lib/hooks/queries/use-get-group-user-tasks";
import {
    GroupUserWithProfile,
    useGetGroupUsers,
} from "@/lib/hooks/queries/use-get-group-users";
import { Tables } from "@/lib/supabase/database.types";
import { useGetGroupTomatoes } from "@/lib/tomatoService";
import {
    addOrdinalSuffix,
    calculateLevel,
    calculateXPForNextLevel,
    cn,
    timestampSplit,
    TOMATO_EMOJI,
} from "@/lib/utils";
import { ExitIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@tanstack/react-router";
import {
    Calendar,
    CheckCircle,
    CircleX,
    Flame,
    Target,
    Trash2,
    Trophy,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import GroupUserProfile, { GroupUser } from "./group-user-profile";
import LeaderboardList from "./leaderboard-list";
import useLeaderboard from "@/hooks/use-leaderboard";
import useLevel from "@/hooks/use-level";
import { ScrollArea } from "../ui/scroll-area";
import useScreenSize from "@/hooks/use-screen-size";
import TomatoGroupUserButton from "./tomato-group-user-button";
import { useDeleteGroupUser } from "@/lib/hooks/mutations/use-delete-group-user";
import SpinnerButton from "@/spinner-button";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";

const LeaveGroupDialog = ({
    handleLeaveGroup,
    isPending,
}: {
    handleLeaveGroup: () => void;
    isPending: boolean;
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <SpinnerButton
                    variant={"destructive"}
                    size={"sm"}
                    disabled={isPending}
                    isPending={isPending}
                    disableWorkCheck
                >
                    <ExitIcon className="size-3 mr-2" /> Leave group
                </SpinnerButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Once you leave this group all your group data will be
                        deleted. To join back you will need a invite.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>
                        <SpinnerButton
                            disableWorkCheck
                            isPending={isPending}
                            onClick={handleLeaveGroup}
                        >
                            Leave
                        </SpinnerButton>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const RemoveUserDialog = ({
    handleRemoveUser,
    isPending,
}: {
    handleRemoveUser: () => void;
    isPending: boolean;
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <SpinnerButton
                    variant={"destructive"}
                    size={"sm"}
                    disabled={isPending}
                    isPending={isPending}
                    disableWorkCheck
                >
                    <Trash2 className="size-3 mr-2" /> Remove user
                </SpinnerButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to remove this user?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will remove the user from the group. Their
                        data within the group will be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <SpinnerButton
                            isPending={isPending}
                            onClick={handleRemoveUser}
                            disableWorkCheck
                        >
                            Remove
                        </SpinnerButton>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

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
    const { data: tomatoes } = useGetGroupTomatoes({
        groupID: groupUser.group_id,
        enabled: !!session,
    });

    const {
        mutateAsync: deleteGroupUser,
        isPending: isDeleteGroupUserPending,
    } = useDeleteGroupUser();

    const { refetch } = useGetGroupUser({
        groupID: groupUser.group_id,
        userID: groupUser.user_id,
        enabled: !!session,
    });

    const navigate = useNavigate();

    const isUserCreator = session
        ? data?.creator_id == session?.user.id
        : false;

    const isUserUs = session ? session?.user.id == groupUser.user_id : false;

    const handleRemoveUser = async () => {
        if (!isUserCreator) return;

        await deleteGroupUser({ id: groupUser.id });
        // TODO : bit hacky but works
        refetch();
    };

    const handleLeaveGroup = async () => {
        if (!isUserUs) return;
        await deleteGroupUser({ id: groupUser.id });
        navigate({ to: "/groups", replace: true });
    };

    const target = tomatoes?.find((t) => t.user_id == groupUser.user_id);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"sm"}>
                    <EyeOpenIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[100vw] sm:min-w-[80vw] md:min-w-[75vw] lg:min-w-[70vw] px-0 ">
                <DialogHeader>
                    <DialogTitle className="sr-only">Group user</DialogTitle>
                    <DialogDescription className="sr-only">
                        View some more details about this user.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[80vh] ">
                    <div className="rounded-lg ">
                        <div className="  rounded-lg   md:px-12 px-2 sm:px-6 space-y-8">
                            <div className="border flex flex-col gap-4 p-2  rounded-xl ">
                                <div className="flex flex-col">
                                    <GroupUser
                                        groupUser={groupUser}
                                        avatarSize={"xl"}
                                        detailSize={"2xl"}
                                    />

                                    <div className="text-sm text-muted-foreground pl-3">
                                        Joined{" "}
                                        <span className="font-semibold">
                                            {data?.name}
                                        </span>{" "}
                                        on{" "}
                                        {
                                            timestampSplit(groupUser.created_at)
                                                .date
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-3">
                                    {isUserCreator && !isUserUs && (
                                        <RemoveUserDialog
                                            handleRemoveUser={handleRemoveUser}
                                            isPending={isDeleteGroupUserPending}
                                        />
                                    )}
                                    {isUserUs && !isUserCreator && (
                                        <LeaveGroupDialog
                                            handleLeaveGroup={handleLeaveGroup}
                                            isPending={isDeleteGroupUserPending}
                                        />
                                    )}
                                    {target && (
                                        <div className="ml-auto">
                                            <TomatoGroupUserButton
                                                size={"sm"}
                                                target={target}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <UserStatsVariant2 groupUser={groupUser} />
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

function UserStatsVariant2({ groupUser }: { groupUser: GroupUserWithProfile }) {
    const levelData = useLevel({ xp: groupUser.xp });

    return (
        <div className="w-full   space-y-6">
            <div className="grid grid-cols-3  gap-2">
                {/* <Card className="col-span-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardContent className="flex justify-between items-center p-6">
                        <div>
                            <p className="text-2xl font-semibold">
                                Level {stats.level}
                            </p>
                            <p className="text-sm opacity-75">
                                Keep going, you're doing great!
                            </p>
                        </div>
                        <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center">
                            <Star className="w-12 h-12" />
                        </div>
                    </CardContent>
                </Card> */}

                <div className="col-span-3 text-muted-foreground text-xs">
                    Current
                </div>
                <StatCard cols={1}>
                    <StatWithIcon value={groupUser.tomatoes} label="Tomatoes">
                        <TomatoIcon />
                    </StatWithIcon>
                </StatCard>

                <StatCard cols={2}>
                    <div className="space-y-4 w-full">
                        <h3 className="text-lg font-semibold mb-2">
                            Today's Progress
                        </h3>
                        <TodayProgress
                            groupID={groupUser.group_id}
                            userID={groupUser.user_id}
                        />
                    </div>
                </StatCard>

                <div className="col-span-3 lg:col-span-2">
                    <Leaderboard
                        groupID={groupUser.group_id}
                        userID={groupUser.user_id}
                    />
                </div>
                <StatCard cols={1} className="md:col-span-3 lg:col-span-1">
                    <div className="flex flex-col  w-full">
                        <h3 className="text-lg font-semibold mb-2">
                            Level {levelData.level}
                        </h3>
                        <div className="flex items-center justify-center">
                            <div className="relative w-32 h-32">
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 36 36"
                                >
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        className="stroke-gray-700"
                                        stroke="#E5E7EB"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        // stroke="#4F46E5"
                                        className="stroke-purple-600 "
                                        strokeWidth="2"
                                        strokeDasharray={`${levelData.progressToNextLevel}, 100`}
                                    />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <p className="font-bold text-xs max-w-[14ch] truncate">
                                        {levelData.xp}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        XP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </StatCard>

                <div className="col-span-3 text-muted-foreground text-xs">
                    All time
                </div>
                <StatCard cols={3}>
                    <StatWithIcon
                        value={groupUser.day_full_completes}
                        label="Fully Completed Days"
                    >
                        <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
                    </StatWithIcon>
                    <StatWithIcon
                        value={groupUser.day_partial_completes}
                        label="Partially Completed Days"
                    >
                        <Calendar className="w-10 h-10 text-green-500 mb-2" />
                    </StatWithIcon>
                    <StatWithIcon
                        value={
                            groupUser.day_full_completes +
                            groupUser.day_partial_completes
                        }
                        label="Total Active Days"
                    >
                        <Flame className="w-10 h-10 text-orange-500 mb-2" />
                    </StatWithIcon>
                </StatCard>

                <StatCard cols={2}>
                    <StatWithIcon
                        value={groupUser.tasks_completed}
                        label="Tasks completed"
                    >
                        <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                    </StatWithIcon>
                    <StatWithIcon
                        value={groupUser.tasks_not_completed}
                        label="Tasks not completed"
                    >
                        <CircleX className="w-10 h-10 text-red-500 mb-2" />
                    </StatWithIcon>
                </StatCard>

                <StatCard>
                    <div className="justify-end flex flex-col h-full  mt-6 ">
                        <p className="text-6xl font-semibold text-muted-foreground ">
                            {groupUser.tasks_completed +
                                groupUser.tasks_not_completed}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Total tasks
                        </p>
                    </div>
                </StatCard>

                <StatCard>
                    <StatWithIcon
                        value={groupUser.total_tomatos}
                        label={
                            <span className="text-sm text-muted-foreground">
                                <span>🧺</span>Gathered
                            </span>
                        }
                    >
                        <TomatoIcon />
                    </StatWithIcon>
                </StatCard>

                <StatCard>
                    <StatWithIcon
                        value={groupUser.tomatoes_thrown}
                        label={
                            <span className="text-sm text-muted-foreground">
                                <span>🤾</span>Thrown
                            </span>
                        }
                    >
                        <TomatoIcon />
                    </StatWithIcon>
                </StatCard>

                <StatCard>
                    <StatWithIcon
                        value={groupUser.tomatoes_received}
                        label={
                            <span className="text-sm text-muted-foreground">
                                <span>🎯</span>Received
                            </span>
                        }
                    >
                        <TomatoIcon />
                    </StatWithIcon>
                </StatCard>

                <StatCard cols={3}>
                    <StatWithIcon
                        value={groupUser.times_being_a_target}
                        label="Times being a target"
                    >
                        <Target className="w-10 h-10 text-blue-500" />
                    </StatWithIcon>

                    <StatWithIcon
                        value={groupUser.times_tomatoed}
                        label="Times you got tomatoed"
                    >
                        <span className="relative w-fit ">
                            <Target className="w-10 h-10 text-blue-500 " />
                            <span className="absolute bottom-0 -left-2 text-2xl">
                                {TOMATO_EMOJI}
                            </span>
                        </span>
                    </StatWithIcon>
                </StatCard>
            </div>
        </div>
    );
}

// TODO : Need to decided what to rank the users by, currently xp
// But could have leaderboard where user selects by what they want to sort
// TODO : Refactor out this component
// TODO : Need to show the value they are ranked by
const Leaderboard = ({
    groupID,
    userID,
}: {
    groupID: string;
    userID: string;
}) => {
    const { leaderboardData, isLoading, isError } = useLeaderboard({
        groupID,
        userID,
    });

    if (isLoading) return <Skeleton className="w-full h-10" />;

    if (isError || !leaderboardData) return null;

    // Ugly but it works for now, changes the size of user detail so it fits properly on all screen sizes
    const screenSize = useScreenSize();
    let userDetailSize: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" = "2xl";
    switch (screenSize) {
        case "xs":
            userDetailSize = "xs";
            break;
        case "sm":
            userDetailSize = "2xl";
            break;
        case "md":
            userDetailSize = "xl";
            break;
        case "lg":
            userDetailSize = "lg";
            break;
        case "xl":
            userDetailSize = "2xl";
            break;
    }

    return (
        <div className="flex  justify-between border rounded-lg p-4 relative">
            <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold">
                    {leaderboardData.userPosition
                        ? addOrdinalSuffix(leaderboardData.userPosition)
                        : "??"}
                </p>
                <p className="text-sm text-muted-foreground">Leaderboard</p>
            </div>
            <div>
                <LeaderboardList
                    groupID={groupID}
                    userID={userID}
                    userDetailSize={userDetailSize}
                />
            </div>
        </div>
    );
};

const TodayProgress = ({
    groupID,
    userID,
}: {
    groupID: string;
    userID: string;
}) => {
    const { session } = useAuth();
    const { data: groupUserTasks, isLoading } = useGetGroupUserTasks({
        groupID,
        userID: userID,
        enabled: !!session,
    });

    const completed =
        groupUserTasks?.filter((task) => task.task_completion.length > 0) || [];

    if (isLoading) return <Skeleton className="w-full h-10" />;

    const completedLength = completed?.length ?? 0;
    const totalTasks = groupUserTasks?.length ?? 0;

    return (
        <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {completedLength}/{totalTasks}
            </div>
            <div className="py-4">
                <Progress value={(completedLength / totalTasks) * 100} />
            </div>
        </div>
    );
};

const TomatoIcon = () => {
    return (
        <span className="w-10 h-10 flex justify-center items-center text-3xl">
            <span>{TOMATO_EMOJI}</span>
        </span>
    );
};

const StatCard = ({
    children,
    className,
    cols = 1,
}: {
    children: React.ReactNode;
    className?: string;
    cols?: number;
}) => {
    // TODO : Very strange ik, but I don't think tailwind will generate stuff for the util if not full string
    // test it later
    return (
        <Card
            className={cn(
                "col-span-3",
                cols == 1 && "md:col-span-1",
                cols == 2 && "md:col-span-2",
                cols == 3 && "md:col-span-3",
                className
            )}
        >
            <CardContent
                className={cn(
                    "p-6 flex  items-center",
                    cols == 1 ? "justify-center" : "justify-between"
                )}
            >
                {children}
            </CardContent>
        </Card>
    );
};

const StatWithIcon = ({
    children,
    value,
    label,
}: {
    children?: React.ReactNode;
    value: number;
    label: React.ReactNode;
}) => {
    return (
        <div className="flex flex-col items-center">
            <div className="mb-2">{children}</div>
            <p className="text-xl font-semibold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
};

// const CenteredText = () => {
//     return()
// }

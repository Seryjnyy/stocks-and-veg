import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Flame,
    Target,
    CheckCircle,
    XCircle,
    Star,
    Trophy,
    Calendar,
} from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";
import SpinnerButton from "@/spinner-button";
import { ExitIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@tanstack/react-router";
import GroupUserProfile, {
    GroupUser,
    GroupUserAvatar,
    UserDetail,
} from "./group-user-profile";
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
import { useGetGroupTomatoes } from "@/lib/tomatoService";
import { TOMATO_EMOJI } from "@/lib/utils";

const LeaveGroupDialog = ({
    handleLeaveGroup,
}: {
    handleLeaveGroup: () => void;
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={"destructive"} size={"sm"}>
                    <ExitIcon className="size-3 mr-2" /> Leave group
                </Button>
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
                    <AlertDialogAction onClick={handleLeaveGroup}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const RemoveUserDialog = ({
    handleRemoveUser,
}: {
    handleRemoveUser: () => void;
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={"destructive"} size={"sm"}>
                    Remove user
                </Button>
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
                    <AlertDialogAction onClick={handleRemoveUser}>
                        Remove
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

    const navigate = useNavigate();

    const isUserCreator = session
        ? data?.creator_id == session?.user.id
        : false;

    const isUserUs = session ? session?.user.id == groupUser.user_id : false;

    const handleRemoveUser = () => {
        // might have to have set dialog state here
        console.error("Not implemented");
    };

    const handleLeaveGroup = () => {
        console.error("Not implemented");
    };

    // TODO : Check if can be tomated, check if not us
    const isAbleToBeTomatoed =
        isUserUs &&
        tomatoes &&
        !tomatoes.find((t) => t.user_id == groupUser.user_id);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"sm"}>
                    <EyeOpenIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[80vw] h-[90vh] px-0 pb-0">
                <DialogHeader>
                    <DialogTitle className="sr-only">Group user</DialogTitle>
                    <DialogDescription className="sr-only">
                        View some more details about this user.
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-hidden rounded-lg">
                    <div className="h-full border-t rounded-lg overflow-y-scroll  px-12 py-4">
                        <div className="border flex flex-col  rounded-xl ">
                            <div className="flex">
                                <GroupUser
                                    groupUser={groupUser}
                                    avatarSize={"xl"}
                                    detailSize={"2xl"}
                                />

                                <div>joined at {groupUser.created_at}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                {isUserCreator && !isUserUs && (
                                    <RemoveUserDialog
                                        handleRemoveUser={handleRemoveUser}
                                    />
                                )}
                                {isUserUs && (
                                    <LeaveGroupDialog
                                        handleLeaveGroup={handleLeaveGroup}
                                    />
                                )}
                                {isAbleToBeTomatoed && (
                                    <Button size={"sm"} variant={"default"}>
                                        Chuck tomatoes
                                        <span className="size-3 ml-2">
                                            {TOMATO_EMOJI}
                                        </span>
                                    </Button>
                                )}
                            </div>
                        </div>
                        <UserStatsVariant2 />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function UserStatsVariant2() {
    // Random data for demonstration
    const stats = {
        totalTasks: 150,
        completedToday: 8,
        notCompletedToday: 3,
        completedOverall: 120,
        notCompletedOverall: 30,
        tomatoesCount: 75,
        level: 7,
        maxLevel: 10,
        xp: 3500,
        daysFullyCompleted: 25,
        daysPartiallyCompleted: 15,
        timesTomatoed: 50,
        tomatoesThrown: 30,
        biggestTomatoedCount: 10,
    };

    return (
        <div className="w-full   space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
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
                </Card>

                <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                        <Target className="w-10 h-10 text-blue-500 mb-2" />
                        <p className="text-xl font-semibold">
                            {stats.totalTasks}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Total Tasks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                        <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                        <p className="text-xl font-semibold">
                            {stats.completedOverall}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tasks Completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                        <span className="w-10 h-10 mb-2">{TOMATO_EMOJI}</span>
                        <p className="text-xl font-semibold">
                            {stats.tomatoesCount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tomatoes Collected
                        </p>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold mb-2">
                            Today's Progress
                        </h3>
                        <div className="flex justify-between items-center">
                            <span>Completed: {stats.completedToday}</span>
                            <span>
                                Not Completed: {stats.notCompletedToday}
                            </span>
                        </div>
                        <Progress
                            value={
                                (stats.completedToday /
                                    (stats.completedToday +
                                        stats.notCompletedToday)) *
                                100
                            }
                            className="h-2"
                        />
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold mb-2">
                            Tomato Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Times Tomatoed
                                </p>
                                <p className="text-xl font-semibold">
                                    {stats.timesTomatoed}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tomatoes Thrown
                                </p>
                                <p className="text-xl font-semibold">
                                    {stats.tomatoesThrown}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Biggest Tomatoed Count
                                </p>
                                <p className="text-xl font-semibold">
                                    {stats.biggestTomatoedCount}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold mb-2">
                            XP Progress
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
                                        stroke="#E5E7EB"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#4F46E5"
                                        strokeWidth="2"
                                        strokeDasharray={`${stats.xp / 100}, 100`}
                                    />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <p className="text-2xl font-bold">
                                        {stats.xp}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        XP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardContent className="p-6 flex justify-between items-center">
                        <div>
                            <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
                            <p className="text-xl font-semibold">
                                {stats.daysFullyCompleted}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Fully Completed Days
                            </p>
                        </div>
                        <div>
                            <Calendar className="w-10 h-10 text-green-500 mb-2" />
                            <p className="text-xl font-semibold">
                                {stats.daysPartiallyCompleted}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Partially Completed Days
                            </p>
                        </div>
                        <div>
                            <Flame className="w-10 h-10 text-orange-500 mb-2" />
                            <p className="text-xl font-semibold">
                                {stats.daysFullyCompleted +
                                    stats.daysPartiallyCompleted}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Total Active Days
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
